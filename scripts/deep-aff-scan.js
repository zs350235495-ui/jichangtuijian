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
console.log('Total files found:', allFiles.length);

const affDomains = [
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

const matches = [];

allFiles.forEach(filePath => {
  const relPath = path.relative(process.cwd(), filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    affDomains.forEach(domain => {
      if (line.includes(domain)) {
        matches.push({
          file: relPath,
          lineNum: idx + 1,
          domain,
          line: line.trim()
        });
      }
    });
  });
});

console.log('Total AFF occurrences:', matches.length);
const byFile = {};
matches.forEach(m => {
  byFile[m.file] = (byFile[m.file] || 0) + 1;
});
console.log('By file:', byFile);
