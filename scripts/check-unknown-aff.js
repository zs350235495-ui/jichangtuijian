const fs = require('fs');
const path = require('path');

function getAllFiles(dir, exts = ['.html', '.md']) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === 'node_modules' || file === '.git' || file === 'dist') return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, exts));
    } else {
      if (exts.includes(path.extname(file).toLowerCase())) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const allFiles = getAllFiles(process.cwd());
const knownDomains = [
  'huanqiutiaff.com',
  'dalaoyunaff.com',
  'yunjiexianaff.com',
  'liulianyunaff.com',
  'shenxingaff.com',
  'shandianshuaff.com',
  'jichang.best',
  'jlyvipaff.com',
  'edgenovaaff.com',
  'kuailiaff.com',
  'kosingaff.com',
  'speedworldaff.cc',
  'ytjcok.org',
  'kunpengjiasu.com',
  'gntvipaff.cc'
];

allFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let m;
  while ((m = hrefRegex.exec(content)) !== null) {
    const url = m[1];
    if (/code=|aff|register|\?ref=/i.test(url) || /aff\.(com|cc|net|org)/i.test(url)) {
      if (!knownDomains.some(kd => url.includes(kd))) {
        console.log('Unrecognized promo link:', f, url);
      }
    }
  }
});
console.log('Scan completed.');
