import * as Sentry from "@sentry/node";
import { checkRateLimit } from "./lib/rate-limit.js";
import { fetchSite } from "./lib/fetch-site.js";
import { analyzeSite } from "./lib/analyze.js";
import { sendAuditEmail, notifyScott } from "./lib/send-email.js";
import { addSubscriber } from "./lib/kit.js";

Sentry.init({
  dsn: "https://484b19c0141142b26e1acb49aaa3593c@o392320.ingest.us.sentry.io/4511043624894464",
  sendDefaultPii: true,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, website, _honeypot } = req.body;

    // Honeypot check — bots fill hidden fields
    if (_honeypot) {
      return res.status(200).json({ success: true });
    }

    // Basic validation
    if (!email || !website) {
      return res.status(400).json({ error: "Email and website URL are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    // Set user context for Sentry
    Sentry.setUser({ email });
    Sentry.setTag("website", website);

    // Rate limit (IP from Vercel's x-forwarded-for or x-real-ip)
    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim()
      || req.headers["x-real-ip"]
      || "unknown";
    const rateCheck = await checkRateLimit(email, ip);
    if (!rateCheck.allowed) {
      return res.status(429).json({ error: rateCheck.reason });
    }

    // Fetch site
    let pages;
    try {
      pages = await fetchSite(website);
    } catch (err) {
      Sentry.captureException(err, { tags: { step: "fetch-site" } });
      return res.status(400).json({ error: err.message });
    }

    // Analyze with Claude Haiku
    const audit = await analyzeSite(pages);

    // Send audit email (critical path — must succeed)
    await sendAuditEmail(email, website, audit);

    // Fire-and-forget: Kit.com subscriber + Scott notification
    addSubscriber(email, website).catch((err) => Sentry.captureException(err, { tags: { step: "kit" } }));
    notifyScott(email, website, audit).catch((err) => Sentry.captureException(err, { tags: { step: "notify-scott" } }));

    return res.status(200).json({ success: true });
  } catch (err) {
    Sentry.captureException(err, { tags: { step: "unhandled" } });
    await Sentry.flush(2000);

    console.error("Audit error:", err);

    // Try to notify Scott even on failure so no lead is lost
    try {
      const { email, website } = req.body || {};
      if (email) {
        await notifyScott(email, website || "unknown", {
          overallScore: "ERROR",
          isLargeSite: false,
          categories: [{ name: "Error", score: 0 }],
        });
      }
    } catch {
      // Nothing we can do
    }

    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
}
