const FETCH_TIMEOUT = 10_000;
const MAX_PAGE_SIZE = 20_000;

function stripHtml(html) {
  // Remove script, style, svg, noscript tags and their content
  let cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "");

  // Truncate to max size
  if (cleaned.length > MAX_PAGE_SIZE) {
    cleaned = cleaned.slice(0, MAX_PAGE_SIZE);
  }

  return cleaned;
}

function extractNavLinks(html, baseUrl) {
  const links = new Set();
  const base = new URL(baseUrl);

  // Match href attributes in nav, header, or general anchor tags
  const hrefRegex = /href=["']([^"'#]+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    try {
      const url = new URL(match[1], baseUrl);
      // Only same-origin, non-asset links
      if (
        url.origin === base.origin &&
        !url.pathname.match(/\.(jpg|jpeg|png|gif|svg|css|js|ico|pdf|zip|woff|woff2|ttf|eot)$/i) &&
        url.pathname !== "/" &&
        url.pathname !== base.pathname
      ) {
        links.add(url.href);
      }
    } catch {
      // Invalid URL, skip
    }
  }

  return [...links].slice(0, 4);
}

async function fetchPage(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "MissoulaBusinessAudit/1.0 (SEO audit tool)",
        Accept: "text/html",
      },
    });

    if (!res.ok) return null;

    const html = await res.text();
    return html;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchSite(url) {
  // Normalize URL
  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  const homepageHtml = await fetchPage(url);
  if (!homepageHtml) {
    throw new Error("Could not fetch the website. Please check the URL and try again.");
  }

  const navLinks = extractNavLinks(homepageHtml, url);

  // Fetch nav pages in parallel
  const navPages = await Promise.all(
    navLinks.map(async (link) => {
      const html = await fetchPage(link);
      if (!html) return null;
      return { url: link, html: stripHtml(html) };
    })
  );

  const pages = [
    { url, html: stripHtml(homepageHtml) },
    ...navPages.filter(Boolean),
  ];

  return pages;
}
