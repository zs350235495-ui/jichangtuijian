const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') || f.endsWith('.md'));
let count = 0;
files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const lines = c.split('\n');
  lines.forEach((l, i) => {
    if (/https?:\/\/[^\s"'>]+(\?|#|\/)(code=|aff|register|\?ref=)/i.test(l) || /aff\.(com|cc|net|org)/i.test(l)) {
      console.log(`${f}:${i + 1}: ${l.trim()}`);
      count++;
    }
  });
});

console.log(`Total remaining aff/promo links: ${count}`);
