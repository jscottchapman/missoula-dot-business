import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// 3 requests per IP per hour (stops bots cycling emails)
const perIp = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1h"),
  prefix: "audit:ip",
});

// 1 audit per email per 24 hours
const perEmail = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, "24h"),
  prefix: "audit:email",
});

// 20 audits per day globally
const globalLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "24h"),
  prefix: "audit:global",
});

// Normalize email: strip +aliases and lowercase
function normalizeEmail(email) {
  const [local, domain] = email.toLowerCase().split("@");
  return local.split("+")[0] + "@" + domain;
}

// Whitelisted emails that bypass all rate limits (for demos and testing)
const WHITELISTED_EMAILS = new Set([
  "scott@ravenviewservices.com",
]);

export async function checkRateLimit(email, ip) {
  const normalized = normalizeEmail(email);

  // Bypass all limits for whitelisted emails
  if (WHITELISTED_EMAILS.has(normalized)) {
    return { allowed: true };
  }

  const [ipResult, emailResult, globalResult] = await Promise.all([
    perIp.limit(ip),
    perEmail.limit(normalized),
    globalLimit.limit("global"),
  ]);

  if (!ipResult.success) {
    return { allowed: false, reason: "Too many requests. Please try again later." };
  }
  if (!emailResult.success) {
    return { allowed: false, reason: "You've already received an audit today. Check your inbox!" };
  }
  if (!globalResult.success) {
    return { allowed: false, reason: "We've hit our daily audit limit. Please try again tomorrow." };
  }

  return { allowed: true };
}
