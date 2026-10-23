const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.startsWith('post') && f.endsWith('.html'));
files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const t = (c.match(/<title>([^<]*)<\/title>/i) || [])[1] || '';
  const d = (c.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) || [])[1] || '';
  const pub = (c.match(/datetime=["']([\d-]+)["']/i) || [])[1] || '2026-10-14';
  const h1 = (c.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '';
  console.log(JSON.stringify({ file: f, title: t, h1: h1.replace(/<[^>]*>/g, '').trim(), date: pub }));
});
