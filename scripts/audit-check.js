const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

console.log('HTML files count:', files.length);

const airportPatterns = [/环球梯/g, /大佬云/g, /云界线/g, /闪电/g, /神行/g, /榴莲/g, /魔戒/g, /速鹰/g, /富贵/g];

files.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
  const found = {};
  airportPatterns.forEach(p => {
    const matches = content.match(p);
    if (matches) {
      found[p.toString()] = matches.length;
    }
  });
  if (Object.keys(found).length > 0) {
    console.log(file, JSON.stringify(found));
  }
});
