const pngToIco = require('png-to-ico');
const fs = require('fs');

pngToIco('markdownviewer.png')
  .then(buf => {
    fs.writeFileSync('markdownviewer.ico', buf);
    console.log('✓ Icon converted successfully!');
  })
  .catch(console.error);
