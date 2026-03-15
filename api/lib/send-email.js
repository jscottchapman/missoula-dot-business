import { MailtrapClient } from "mailtrap";
import { buildAuditEmail, buildNotificationEmail } from "./email-templates.js";

let client;
function getClient() {
  if (!client) {
    client = new MailtrapClient({ token: process.env.MAILTRAP_API_KEY });
  }
  return client;
}

const FROM = { name: "Missoula.business", email: "audit@missoula.business" };

export async function sendAuditEmail(email, websiteUrl, audit) {
  const html = buildAuditEmail(audit, websiteUrl);

  await getClient().send({
    from: FROM,
    to: [{ email }],
    subject: `Your SEO Audit: ${websiteUrl} scored ${audit.overallScore}/100`,
    html,
  });
}

export async function notifyScott(email, websiteUrl, audit) {
  const html = buildNotificationEmail(email, websiteUrl, audit);

  await getClient().send({
    from: FROM,
    to: [{ email: "scott@ravenviewservices.com" }],
    subject: `New Audit Lead: ${websiteUrl} (${audit.overallScore}/100)`,
    html,
  });
}
