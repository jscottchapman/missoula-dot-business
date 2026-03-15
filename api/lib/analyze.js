import Anthropic from "@anthropic-ai/sdk";

// Route through ngrok AI Gateway when configured (credit-based cost cap,
// observability, failover). Falls back to direct Anthropic API otherwise.
let client;
function getClient() {
  if (!client) {
    const opts = {};
    if (process.env.NGROK_AI_GATEWAY_URL) {
      opts.baseURL = process.env.NGROK_AI_GATEWAY_URL;
      opts.apiKey = process.env.NGROK_AI_GATEWAY_KEY;
    } else if (process.env.ANTHROPIC_API_KEY) {
      opts.apiKey = process.env.ANTHROPIC_API_KEY;
    }
    client = new Anthropic(opts);
  }
  return client;
}

const SYSTEM_PROMPT = `You are an expert SEO, GEO (Generative Engine Optimization), and AEO (Answer Engine Optimization) auditor. You analyze website HTML and return a structured audit.

Analyze the provided pages and return a JSON object with this exact structure:
{
  "overallScore": <number 1-100>,
  "summary": "<2-3 sentence summary of the site's SEO health>",
  "categories": [
    {
      "name": "<category name>",
      "score": <number 1-100>,
      "findings": ["<specific finding 1>", "<specific finding 2>"],
      "recommendation": "<one actionable recommendation>"
    }
  ],
  "isLargeSite": <boolean>,
  "largeSiteNote": "<optional string, only when isLargeSite is true>"
}

Categories to evaluate:
1. Meta Tags — title, description, canonical, viewport, robots
2. Structured Data — JSON-LD, schema.org markup, rich snippet eligibility
3. Headings & Content — H1-H6 hierarchy, content quality, keyword usage
4. Local SEO — NAP consistency, Google Business Profile signals, local schema
5. Open Graph & Social — OG tags, Twitter cards, social sharing readiness
6. AI/LLM Readiness — llms.txt, clear factual content, citation-worthy structure, FAQ schema
7. Mobile & Performance — viewport, responsive hints, resource loading
8. E-E-A-T Signals — expertise, experience, authoritativeness, trustworthiness indicators
9. FAQ & Rich Results — FAQ schema, how-to markup, review/rating eligibility

For isLargeSite detection, look for: navigation menus with many links, pagination elements, date-based URL patterns, archive pages, blog indexes, category pages, or breadcrumbs suggesting deep hierarchy. When detected, set isLargeSite to true and write a brief largeSiteNote explaining what was detected and why a deeper multi-page crawl would be valuable.

Be specific and actionable. Reference actual elements (or lack thereof) from the HTML. Keep findings concise.

Return ONLY the JSON object, no markdown fences or extra text.`;

export async function analyzeSite(pages) {
  const pagesContent = pages
    .map((p, i) => `--- Page ${i + 1}: ${p.url} ---\n${p.html}`)
    .join("\n\n");

  const response = await getClient().messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Analyze the following website pages for SEO, GEO, and AEO:\n\n${pagesContent}`,
      },
    ],
    system: SYSTEM_PROMPT,
  });

  const text = response.content[0].text;

  try {
    return JSON.parse(text);
  } catch {
    // Try to extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Failed to parse audit results");
  }
}
