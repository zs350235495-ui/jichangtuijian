const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') || f.endsWith('.md'));
const matches = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const regex = /href=["'](https?:\/\/[^"']+)["']/gi;
  let m;
  while ((m = regex.exec(content)) !== null) {
    matches.push({ file: f, url: m[1] });
  }
});

const urlCounts = {};
matches.forEach(({file, url}) => {
  if (!urlCounts[url]) {
    urlCounts[url] = { count: 0, files: new Set() };
  }
  urlCounts[url].count++;
  urlCounts[url].files.add(file);
});

console.log('Total external links:', matches.length);
console.log('Unique URLs:');
Object.entries(urlCounts).forEach(([url, data]) => {
  console.log(`[${data.count}] ${url} (in: ${Array.from(data.files).join(', ')})`);
});
