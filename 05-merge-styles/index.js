const path = require('path');
const fs = require('fs');

function joinCss() {
  let allStyles = '';
  fs.readdir(
    path.join(__dirname, 'styles'),
    { withFileTypes: true },
    (err, data) => {
      if (err) console.log(err.message);
      data.forEach((file) => {
        const writeStream = fs.createWriteStream(
          path.join(__dirname, 'project-dist/bundle.css')
        );
        if (file.isFile() && path.extname(file.name) === '.css') {
          const stream = fs.createReadStream(
            path.join(__dirname, 'styles', file.name),
            'utf-8'
          );
          stream.on('data', (chunk) => {
            allStyles += chunk;
            writeStream.write(allStyles);
          });
        }
      });
    }
  );
}

joinCss();
