const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'logo4.png');
const dest = path.join(__dirname, 'public', 'logo.png');

fs.copyFileSync(src, dest);
console.log('Moved logo successfully');
