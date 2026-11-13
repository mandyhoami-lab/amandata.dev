// hand-written, not compiled from .ts
// Builds /rss.xml from posts/index.json + posts/*.md. Run by the Build
// workflow whenever posts change; run locally with `npm run rss`.
// The feed format is borrowed from korikosmos.dev's /rss.xml.
import { readFile, writeFile } from "node:fs/promises";

const SITE = "https://amandata.dev";

const esc = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&apos;");

// Drops the post's own "# title" heading and "**On this page:**" contents
// line first, so the excerpt starts with the actual writing.
function excerpt(body) {
  const text = String(body)
    .split("\n")
    .filter((line) => !/^#\s/.test(line) && !/^\*\*On this page:?\*\*/i.test(line.trim()))
    .join("\n")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*`_~|-]/g, "")
    .replace(/\[|\]|\(|\)/g, "")
    .replace(/\n+/g, " ").trim();
  return text.length > 280 ? text.slice(0, 280) + "…" : text;
}

// Dates in the manifest are calendar days; publish them at noon UTC so the
// day doesn't shift for readers in other timezones.
const rfc822 = (day) => new Date(day + "T12:00:00Z").toUTCString();

const index = JSON.parse(await readFile("posts/index.json", "utf8"));
const posts = [...index].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

const items = await Promise.all(posts.map(async (p) => {
  const body = await readFile(`posts/${p.slug}.md`, "utf8");
  const url = `${SITE}/blog.html?p=${encodeURIComponent(p.slug)}`;
  return `    <item>
      <title>${esc(p.title)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <description>${esc(excerpt(body))}</description>
    </item>`;
}));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Amanda Ta, blog</title>
    <link>${SITE}/blog.html</link>
    <description>Notes and essays by Amanda Ta.</description>
    <language>en</language>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
${posts.length ? `    <lastBuildDate>${rfc822(posts[0].date)}</lastBuildDate>\n` : ""}${items.join("\n")}
  </channel>
</rss>
`;

await writeFile("rss.xml", xml);
console.log(`rss.xml: ${posts.length} posts`);
