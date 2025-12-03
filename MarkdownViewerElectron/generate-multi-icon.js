const pngToIco = require('png-to-ico');
const fs = require('fs');

pngToIco('markdownviewer.png')
  .then(buf => {
    fs.writeFileSync('build/icons/icon.ico', buf);
    console.log('✓ Multi-resolution icon created successfully');
  })
  .catch(err => {
    console.error('Error creating icon:', err);
    process.exit(1);
  });
