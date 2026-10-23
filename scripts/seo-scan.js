const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

console.log(`Auditing ${files.length} HTML files in root...`);

const report = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
  
  // Title
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : '';

  // Canonical
  const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1] : '';

  // H1
  const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];

  // JSON-LD
  const jsonLdMatches = content.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi) || [];

  // OG tags
  const ogTitle = /<meta\s+property=["']og:title["']/i.test(content);
  const ogDesc = /<meta\s+property=["']og:description["']/i.test(content);
  const ogUrl = /<meta\s+property=["']og:url["']/i.test(content);
  const ogImage = /<meta\s+property=["']og:image["']/i.test(content);
  const twitterCard = /<meta\s+name=["']twitter:card["']/i.test(content);

  // TG link
  const tgLink = /t\.me/i.test(content);

  // aff link
  const affLink = /aff\.com|\?code=|\?aff=|\?ref=/i.test(content);

  // CSS and JS path styles
  const relativeCss = /href=["']\.\/css\//i.test(content);
  const relativeJs = /src=["']\.\/js\//i.test(content);
  const relativeAssets = /href=["']\.\/assets\/|src=["']\.\/assets\//i.test(content);

  // Images without alt
  const imgTags = content.match(/<img[^>]*>/gi) || [];
  const imgNoAlt = imgTags.filter(img => !/alt=["'][^"']*["']/i.test(img));

  report.push({
    file,
    title,
    canonical,
    h1Count: h1Matches.length,
    jsonLdCount: jsonLdMatches.length,
    ogTitle,
    ogDesc,
    ogUrl,
    ogImage,
    twitterCard,
    tgLink,
    affLink,
    relativeCss,
    relativeJs,
    relativeAssets,
    imgNoAltCount: imgNoAlt.length
  });
});

console.log(JSON.stringify(report, null, 2));
