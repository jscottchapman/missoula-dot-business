# GEO/SEO/AEO Audit Report — missoula.business

**Audit Date:** April 8, 2026
**Site:** https://missoula.business
**Local file:** `~/Projects/missoula-dot-business/index.html`
**Business type:** Local AI consulting / automation services, Missoula, MT

---

## Composite GEO Score: 72 / 100

| Category | Score | Weight | Weighted |
|---|---|---|---|
| Technical SEO | 78/100 | 15% | 11.7 |
| Meta Tags & OG | 82/100 | 10% | 8.2 |
| Structured Data / Schema | 90/100 | 15% | 13.5 |
| AI Crawler Access (robots/llms.txt) | 45/100 | 15% | 6.75 |
| AI Citability & AEO | 75/100 | 15% | 11.25 |
| Content Quality & E-E-A-T | 85/100 | 15% | 12.75 |
| Local SEO | 70/100 | 15% | 10.5 |
| **Total** | | **100%** | **74.65 → 72** |

*Score adjusted down 2 points for critical robots.txt gap and live/local file drift.*

---

## CRITICAL Issues

### 1. robots.txt has NO AI crawler directives
**Severity:** CRITICAL
**Current state (live + local):**
```
User-agent: *
Allow: /

Sitemap: https://missoula.business/sitemap.xml
```

**Problem:** The `User-agent: *` with `Allow: /` technically permits all bots, but explicitly naming AI crawlers is a strong positive signal that you welcome AI indexing. Without explicit directives, some AI crawlers may deprioritize your content or apply conservative defaults. More importantly, if any AI search engine adds a default-block policy for sites that don't explicitly allow them, you're invisible overnight.

**Fix — replace robots.txt with:**
```
User-agent: *
Allow: /

# AI Search Crawlers — explicitly allowed
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Bytespider
Allow: /

User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: cohere-ai
Allow: /

Sitemap: https://missoula.business/sitemap.xml
```

### 2. Meta Pixel has placeholder ID
**Severity:** CRITICAL
**Location:** `index.html` lines 195-198
**Current:** `fbq('init', 'META_PIXEL_ID');` and `tr?id=META_PIXEL_ID`
**Problem:** Facebook/Meta tracking is completely broken. Every pageview fires with a fake pixel ID. This means zero retargeting data, zero conversion tracking from Facebook ads, and console errors on every load.
**Fix:** Replace `META_PIXEL_ID` with your actual Meta Pixel ID from Events Manager, or remove the pixel entirely until you have one configured.

---

## HIGH Issues

### 3. llms.txt not accessible on live site
**Severity:** HIGH
**Current state:** The file exists locally and in the sitemap, but WebFetch returned no content from `https://missoula.business/llms.txt`. The `vercel.json` sets the correct `Content-Type` header, so this may be a deployment timing issue or the file wasn't included in the last deploy.
**Local file quality:** Excellent. The llms.txt is well-structured with services, pricing, case studies, FAQ, and contact info. It follows the emerging llms.txt standard properly.
**Fix:** Verify the file is deployed. Run `curl -I https://missoula.business/llms.txt` to check status. Redeploy if needed.

### 4. No OG image / Twitter image
**Severity:** HIGH
**Current meta tags:**
```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:type" content="website">
<meta property="og:url" content="https://missoula.business/">
```
**Missing:**
- `og:image` — no social sharing image
- `og:image:width` / `og:image:height`
- `twitter:image`
- `twitter:site` / `twitter:creator`

**Problem:** When shared on LinkedIn, Facebook, Twitter/X, or Slack, the link preview shows no image. This dramatically reduces click-through rates (posts with images get 2-3x more engagement). You have a `social-cards/` directory in the project — use it.

**Fix — add to `<head>`:**
```html
<meta property="og:image" content="https://missoula.business/social-cards/og-default.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://missoula.business/social-cards/og-default.png">
<meta name="twitter:site" content="@thescottsy">
<meta name="twitter:creator" content="@thescottsy">
```
Create a 1200x630 OG image if one doesn't exist in `social-cards/`.

### 5. Live site and local file have diverged
**Severity:** HIGH
**Differences noticed:**
- Live H1: "Your business runs on _your time_. AI gives it back."
- Local H1: "You didn't start a business to fight with software."
- Live hero badge: "AI-Powered Automation"
- Local hero badge: "Missoula, Montana"
- Live pain point headings differ from local (e.g., "Marketing takes forever" vs "Marketing eats your evenings")
- Live H2 "Sound familiar?" vs local "You know that feeling."
- Live has "Guide" section with different framing

**Problem:** You're auditing a version that isn't deployed. Any changes need a deploy to take effect.
**Fix:** Deploy the local version, or be aware this audit covers the local `index.html` primarily.

### 6. No Google Business Profile link or LocalBusiness aggregate rating
**Severity:** HIGH
**Problem:** The schema markup has no `sameAs` array for the business (only the founder's LinkedIn). No Google Business Profile URL. No `aggregateRating`. For local SEO, Google wants to see connections between your website, GBP, and social profiles.
**Fix — add to ProfessionalService schema:**
```json
"sameAs": [
  "https://www.linkedin.com/in/rvnvw/",
  "https://www.linkedin.com/company/ravenview-services",
  "https://g.co/kgs/YOUR_GBP_SHORT_LINK"
],
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "5.0",
  "reviewCount": "X",
  "bestRating": "5"
}
```
If you don't have a GBP yet, create one immediately — it's the single highest-impact local SEO action.

---

## MEDIUM Issues

### 7. Sitemap is minimal and stale
**Severity:** MEDIUM
**Current:** 2 URLs (index + llms.txt), both with `lastmod: 2026-03-15` (24 days old).
**Fix:**
- Update `lastmod` to today's date on every deploy
- Consider adding the social card images as image entries if they're standalone landing assets
- Add a `robots.txt` entry is already present (good)

### 8. FAQ heading is generic — "Questions"
**Severity:** MEDIUM
**Current:** `<h2>Questions</h2>`
**Problem:** H2 headings are signals for both traditional SEO and AI extraction. "Questions" is a wasted signal. AI systems looking for FAQ content key off heading text.
**Fix:** Change to `<h2>Frequently Asked Questions About AI Automation in Missoula</h2>` or at minimum `<h2>FAQ — AI Automation for Missoula Businesses</h2>`

### 9. Several H2s are emotional/narrative, not keyword-rich
**Severity:** MEDIUM
**Current H2s that waste SEO signal:**
- "You know that feeling." — zero keyword value
- "You don't need more tools. You need someone who gets it." — too long, no keywords
- "Here's how it works." — generic
- "What it looks like on the other side." — narrative, no keywords
- "What happens if you keep doing it the same way?" — no keywords
- "Your guide" — generic
- "What it costs" — weak vs "AI Automation Pricing"

**The copy is excellent for conversion. The issue is strictly for search/AI extraction.**

**Fix — keep the emotional copy as visible text but restructure:**
- Wrap the emotional text in `<p>` tags instead
- Use keyword-rich H2s: "AI Automation Services for Missoula Businesses", "How AI Automation Works", "AI Consulting Pricing", "About J Scott Chapman — Missoula AI Consultant"
- Or use a hybrid: `<h2>How AI Automation Works <span class="sr-only">for Missoula Businesses</span></h2>` with screen-reader-only text

### 10. No hreflang or language declaration beyond `lang="en"`
**Severity:** MEDIUM (low impact for a local site, but a gap)
**Fix:** Not needed for a Missoula-only business. Mark as accepted risk.

### 11. Missing `<address>` element in footer
**Severity:** MEDIUM
**Problem:** The footer has contact info as plain links. Wrapping in `<address>` provides semantic HTML that search engines recognize as contact information.
**Fix:**
```html
<address>
  <a href="tel:+14062008107">(406) 200-8107</a>
  <a href="mailto:scott@ravenviewservices.com">scott@ravenviewservices.com</a>
</address>
```

### 12. No `datePublished` / `dateModified` in schema
**Severity:** MEDIUM
**Problem:** Schema has no temporal signals. AI systems and search engines use these to assess content freshness.
**Fix — add to ProfessionalService schema:**
```json
"datePublished": "2026-02-01",
"dateModified": "2026-04-08"
```

---

## LOW Issues

### 13. No IndexNow integration on deploy
**Severity:** LOW
**Note:** `ping-indexnow.sh` exists in the project, which is great. Verify it runs on every Vercel deploy (post-deploy hook or CI step).

### 14. Heading hierarchy has gaps
**Severity:** LOW
**Issue:** Some sections jump from H2 to inline text with no H3, while others use H3 properly. The heading outline is mostly clean but could be tighter for accessibility and AI extraction.

### 15. No `speakable` schema
**Severity:** LOW
**Problem:** Google's speakable structured data tells voice assistants which sections to read aloud. For a local business trying to appear in voice search, this is a differentiator.
**Fix — add to schema:**
```json
"speakable": {
  "@type": "SpeakableSpecification",
  "cssSelector": [".hero h1", ".hero .subtitle", "#faq details"]
}
```

### 16. Inline styles reduce crawl efficiency
**Severity:** LOW
**Problem:** Multiple elements use inline `style` attributes (the pain section, vision section, etc.). This bloats HTML size and makes it harder for AI to parse semantic content vs presentation.
**Fix:** Move inline styles to the `<style>` block. Not urgent but improves code quality.

### 17. No `rel="me"` links for identity verification
**Severity:** LOW
**Fix:** Add `rel="me"` to LinkedIn and other profile links in the footer for IndieWeb identity verification.

---

## AI Citability Analysis (AEO Score: 75/100)

### Strengths
- **Answer-first FAQ structure:** Each FAQ answer starts with a direct answer, then elaborates. This is ideal for AI extraction.
- **Self-contained passages:** The llms.txt file is excellent — every section can stand alone as a cited passage.
- **Named entities:** J Scott Chapman, Missoula, Montana, Ravenview Services, TechFix/ATG, Lowell Greene, Big Sky Code Academy, Montana Code Girls, Big Sky Dev Con, Carolina Code Conference, Missoula Public Library — all well-placed.
- **Specific stats:** "10-20 hours per week", "98% delivery rate", "2x engagement", "$500-$2,000", "3-5 days", "4 AWS ML/AI certifications" — concrete, citable numbers.
- **Case studies with metrics:** Two detailed case studies with quantified results.

### Weaknesses
- **No question-based H2 headings:** AI systems (especially Perplexity, ChatGPT search) extract content anchored to question headings. Your FAQ uses `<summary>` tags inside `<details>`, which is good for UI but some AI crawlers may miss the collapsed content.
- **Missing "What is" / "Who is" definitional paragraphs:** Add a clear definitional paragraph early on: "Missoula.business is an AI automation consultancy based in Missoula, Montana, operated by J Scott Chapman. We build custom AI workflows..."
- **No statistics attribution:** Stats like "46% of Google searches are local" have no source citation. AI systems may skip uncited statistics.
- **Testimonials not in schema:** The two testimonials are in HTML but not in the JSON-LD schema as `Review` objects.

### Recommendations for AI Citability
1. Add a visible, non-collapsed "About Missoula.business" paragraph near the top with entity-dense, factual text
2. Add `Review` schema for each testimonial
3. Add source attribution to the "46% of Google searches are local" stat
4. Consider an `article` or `WebPage` schema wrapper with `mainEntity` pointing to the FAQ
5. Ensure the `<details>` FAQ content is rendered server-side (it is — static HTML, so AI crawlers can see it even when collapsed)

---

## Local SEO Analysis (Score: 70/100)

### Present
- NAP (Name, Address, Phone) consistent across page and schema
- `PostalAddress` with city, state, zip, country
- `GeoCoordinates` with lat/long for Missoula
- `areaServed` covers both Missoula (City) and Montana (State)
- Phone number in nav, footer, and schema (consistent: 406-200-8107)
- Email consistent: scott@ravenviewservices.com
- `priceRange: "$$"` set

### Missing
- **Google Business Profile:** No GBP URL anywhere. This is the #1 local ranking factor. If you don't have a verified GBP listing, create one today.
- **Reviews/ratings:** No `aggregateRating` in schema. No Google review count displayed on site.
- **Service area pages:** Single page site — no dedicated pages for specific services or industries. This limits long-tail local keyword capture.
- **Local citations:** No mention of Missoula Chamber, local directories, or community affiliations beyond the Library talk.
- **Street address:** Schema has zip 59801 but no street address. Google prefers full addresses for local pack results.

---

## Structured Data Validation

### ProfessionalService Schema — GOOD
- Valid `@type: ProfessionalService`
- Complete `address`, `geo`, `founder`, `areaServed`
- `hasOfferCatalog` with 4 services — well structured
- `serviceType` and `knowsAbout` arrays provide strong topical signals

### Issues Found
1. **`url` value inconsistent:** Schema has `"url": "https://missoula.business"` (no trailing slash) but canonical is `https://missoula.business/` (with trailing slash). Pick one. Recommendation: use trailing slash everywhere.
2. **No `@id` on the main entity:** Adding `"@id": "https://missoula.business/#business"` enables other schema to reference this entity.
3. **No `openingHours`:** Even "by appointment" is better than nothing for local pack eligibility.
4. **Founder `sameAs` is only LinkedIn:** Add GitHub, personal site, etc.

### FAQPage Schema — GOOD
- Valid structure with 8 Q&A pairs
- Matches visible FAQ content (slight wording differences between live and local versions)
- All answers are substantive, not one-liners

---

## Summary — Top 5 Actions by Impact

| Priority | Action | Impact | Effort |
|---|---|---|---|
| 1 | Fix robots.txt with explicit AI crawler Allow directives | HIGH — unlocks AI search visibility | 5 min |
| 2 | Add OG image + Twitter card image | HIGH — dramatically improves social sharing CTR | 30 min |
| 3 | Create/verify Google Business Profile, add to schema | HIGH — #1 local ranking factor | 1 hr |
| 4 | Deploy local index.html (or verify live version is current) | HIGH — ensures all optimizations are live | 5 min |
| 5 | Verify llms.txt is accessible on live site | HIGH — AI search engines use this for context | 5 min |

### Quick Wins (under 15 minutes each)
- Fix Meta Pixel ID or remove placeholder
- Add `dateModified` to schema
- Update sitemap `lastmod` dates
- Add `@id` to ProfessionalService schema
- Fix canonical URL consistency (trailing slash)
- Add `<address>` semantic element to footer
- Add source citation to "46% of Google searches" stat

---

*Report generated for J Scott Chapman / missoula.business*
*Methodology: Manual audit of HTML source, live site fetch, schema validation, robots/llms/sitemap review, AI citability scoring*
