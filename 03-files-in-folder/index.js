const fs = require('fs/promises');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }).then(
  (data) => {
    data.forEach((file) => {
      if (file.isFile()) {
        const name = file.name.split('.');
        const ext = path.extname(file.name).slice(1);
        fs
          .stat(path.join(__dirname, 'secret-folder', file.name))
          .then((data) => {
            console.log(`${name[0]} - ${ext} - ${data.size}b`);
          });
      }
    });
  }
);
