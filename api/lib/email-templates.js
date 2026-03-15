function scoreColor(score) {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#eab308";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

function scoreBar(score) {
  const color = scoreColor(score);
  return `
    <div style="background:#e5e7eb;border-radius:4px;height:8px;width:100%;margin-top:4px;">
      <div style="background:${color};border-radius:4px;height:8px;width:${score}%;"></div>
    </div>`;
}

export function buildAuditEmail(audit, websiteUrl) {
  const categories = audit.categories
    .map(
      (cat) => `
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid #e5e7eb;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong style="color:#111827;font-size:15px;">${cat.name}</strong>
            <span style="color:${scoreColor(cat.score)};font-weight:700;font-size:15px;">${cat.score}/100</span>
          </div>
          ${scoreBar(cat.score)}
          <ul style="margin:8px 0 0 16px;padding:0;color:#6b7280;font-size:13px;line-height:1.6;">
            ${cat.findings.map((f) => `<li>${f}</li>`).join("")}
          </ul>
          <p style="margin:8px 0 0;color:#111827;font-size:13px;">
            <strong>Recommendation:</strong> ${cat.recommendation}
          </p>
        </td>
      </tr>`
    )
    .join("");

  const largeSiteCallout = audit.isLargeSite
    ? `
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin:16px 0;">
      <p style="margin:0;color:#1e40af;font-size:14px;">
        <strong>Your site appears to have many pages.</strong> ${audit.largeSiteNote || "This audit covers your homepage — a deeper analysis of your full site would reveal additional opportunities around duplicate content, internal linking, and indexing."}
      </p>
    </div>`
    : "";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:#ffffff;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">

      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="margin:0;font-size:22px;color:#111827;">Your SEO Audit Results</h1>
        <p style="margin:4px 0 0;color:#6b7280;font-size:14px;">${websiteUrl}</p>
      </div>

      <div style="text-align:center;margin:24px 0;">
        <div style="display:inline-block;width:100px;height:100px;border-radius:50%;border:6px solid ${scoreColor(audit.overallScore)};line-height:88px;font-size:32px;font-weight:800;color:${scoreColor(audit.overallScore)};">
          ${audit.overallScore}
        </div>
        <p style="margin:8px 0 0;color:#6b7280;font-size:14px;">Overall Score</p>
      </div>

      <p style="color:#374151;font-size:15px;line-height:1.6;margin:16px 0;">${audit.summary}</p>

      ${largeSiteCallout}

      <table style="width:100%;border-collapse:collapse;">
        ${categories}
      </table>

      <div style="text-align:center;margin:32px 0 16px;">
        <p style="color:#374151;font-size:15px;margin:0 0 16px;">Want help implementing these recommendations?</p>
        <a href="mailto:scott@ravenviewservices.com?subject=SEO%20Audit%20Follow-up%20—%20${encodeURIComponent(websiteUrl)}" style="display:inline-block;padding:12px 32px;background:#111827;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:15px;">Schedule a Free Call</a>
      </div>

    </div>

    <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">
      Sent by <a href="https://missoula.business" style="color:#9ca3af;">missoula.business</a> — AI &amp; automation for Missoula businesses
    </p>
  </div>
</body>
</html>`;
}

export function buildNotificationEmail(email, websiteUrl, audit) {
  return `
<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,sans-serif;padding:24px;">
  <h2>New SEO Audit Lead</h2>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Website:</strong> ${websiteUrl}</p>
  <p><strong>Overall Score:</strong> ${audit.overallScore}/100</p>
  <p><strong>Large Site:</strong> ${audit.isLargeSite ? "Yes" : "No"}</p>
  <h3>Category Scores</h3>
  <ul>
    ${audit.categories.map((c) => `<li>${c.name}: ${c.score}/100</li>`).join("")}
  </ul>
</body>
</html>`;
}
