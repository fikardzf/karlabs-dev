const fs = require('fs');
const requiredFiles = ['index.html', 'catalog.html', 'package.json'];
let ok = true;
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`Missing required file: ${file}`);
    ok = false;
  }
}
if (!ok) process.exit(1);
console.log('Static project check passed.');
