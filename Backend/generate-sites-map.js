const fs = require("fs");
const urls = [
  { loc: "https://tokoku.com/produk/sepatu-abc", lastmod: "2025-05-29" },
  { loc: "https://tokoku.com/produk/kaos-xyz", lastmod: "2025-05-28" },
];

function generateSitemap(urls) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
  </url>`
    )
    .join("")}
</urlset>`;
  return xml;
}

fs.writeFileSync("public/sitemap.xml", generateSitemap(urls));
