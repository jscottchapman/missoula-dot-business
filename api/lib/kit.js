export async function addSubscriber(email, websiteUrl) {
  const apiKey = (process.env.KIT_API_KEY || "").trim();
  const formId = process.env.KIT_FORM_ID;

  if (!apiKey || !formId) return;

  await fetch(`https://api.kit.com/v4/forms/${formId}/subscribers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      email_address: email,
      fields: { website: websiteUrl },
      tags: ["website-audit"],
    }),
  });
}
