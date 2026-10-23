const fs = require('fs');
const c = fs.readFileSync('rankings.html', 'utf8');
const regex = /id=["'](item-\d+)["'][\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/g;
let m;
while ((m = regex.exec(c)) !== null) {
  console.log(m[1], '->', m[2].replace(/<[^>]*>/g, '').trim());
}
