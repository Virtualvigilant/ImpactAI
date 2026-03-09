const fs = require('fs');
const path = require('path');
const src = path.join(require('os').homedir(), '.gemini', 'antigravity', 'brain', '800bd2aa-c5b5-4cd0-92fa-0ad6b58f1d12', 'media__1773082277943.png');
const dest = path.join(__dirname, 'public', 'logo.png');
fs.copyFileSync(src, dest);
console.log('Copied logo successfully.');
