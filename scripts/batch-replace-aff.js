const fs = require('fs');
const path = require('path');

const PARTNERS = [
  { id: 'huanqiuti', domain: 'huanqiutiaff.com' },
  { id: 'dalaoyun', domain: 'dalaoyunaff.com' },
  { id: 'yunjiexian', domain: 'yunjiexianaff.com' },
  { id: 'liulianyun', domain: 'liulianyunaff.com' },
  { id: 'shenxing', domain: 'shenxingaff.com' },
  { id: 'shandianshu', domain: 'shandianshuaff.com' },
  { id: 'shunyun', domain: 'jichang.best' },
  { id: 'jilianyun', domain: 'jlyvipaff.com' },
  { id: 'edgenode', domain: 'edgenovaaff.com' },
  { id: 'kuaili', domain: 'kuailiaff.com' },
  { id: 'kexinyun', domain: 'kosingaff.com' },
  { id: 'sujie', domain: 'speedworldaff.cc' },
  { id: 'yuntu', domain: 'ytjcok.org' },
  { id: 'kunpeng', domain: 'kunpengjiasu.com' },
  { id: 'guangnianti', domain: 'gntvipaff.cc' }
];

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

const files = getAllFiles(process.cwd());
let totalReplacements = 0;
const fileStats = {};

files.forEach(filePath => {
  const relPath = path.relative(process.cwd(), filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  let fileCount = 0;

  // 正则匹配所有 a 标签
  const aTagRegex = /<a\b([^>]*)>/gi;

  const newContent = content.replace(aTagRegex, (match, attrs) => {
    // 检查是否包含任何 PARTNER 的 domain
    const matchedPartner = PARTNERS.find(p => attrs.includes(p.domain));
    if (!matchedPartner) return match;

    fileCount++;
    totalReplacements++;

    // 1. 替换 href 属性
    let newAttrs = attrs.replace(/href=["'][^"']+["']/i, `href="/go.html?id=${matchedPartner.id}"`);

    // 2. 规范化 rel 属性为严格的 rel="nofollow sponsored noopener noreferrer"
    if (/rel=["'][^"']*["']/i.test(newAttrs)) {
      newAttrs = newAttrs.replace(/rel=["'][^"']*["']/i, 'rel="nofollow sponsored noopener noreferrer"');
    } else {
      newAttrs += ' rel="nofollow sponsored noopener noreferrer"';
    }

    // 3. 确保拥有 target="_blank"
    if (!/target=["'][^"']*["']/i.test(newAttrs)) {
      newAttrs += ' target="_blank"';
    }

    return `<a${newAttrs}>`;
  });

  if (fileCount > 0) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    fileStats[relPath] = fileCount;
  }
});

console.log('====================================================');
console.log('AFF 链接 301 隔离与合规批量替换完成！');
console.log('====================================================');
console.log('各文件替换明细:');
Object.entries(fileStats).forEach(([file, count]) => {
  console.log(`  - ${file}: ${count} 处链接已替换为安全内链`);
});
console.log('----------------------------------------------------');
console.log(`全站累计替换总数: ${totalReplacements} 处`);
console.log('====================================================');
