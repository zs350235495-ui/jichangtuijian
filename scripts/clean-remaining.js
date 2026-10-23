const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const replacements = [
  { regex: /https:\/\/ddd\.jichang\.best\/#\/register\?code=nldUZaYc/g, rep: '/rankings.html#item-7' },
  { regex: /https:\/\/pygllc\.speedworldaff\.cc\/#\/\?code=kcoensXG/g, rep: '/rankings.html#item-12' },
  { regex: /https:\/\/super\.ytjcok\.org\/#\/register\?code=poKwFVtv/g, rep: '/rankings.html#item-13' },
  { regex: /https:\/\/kunpengjiasu\.com\/#\/register\?code=WPugVZUe/g, rep: '/rankings.html#item-14' },
  { regex: /https:\/\/gnt001\.gntvipaff\.cc\/#\/\?code=PQhPFDhO/g, rep: '/rankings.html#item-15' }
];

files.forEach(file => {
  const filePath = path.join(rootDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  replacements.forEach(({ regex, rep }) => {
    if (regex.test(content)) {
      content = content.replace(regex, rep);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned remaining links in: ${file}`);
  }
});

console.log('Finished cleaning remaining links!');
