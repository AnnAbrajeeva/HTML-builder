const path = require('path');
const fs = require('fs/promises');

async function copyDir() {
  await fs.access(path.join(__dirname, 'files-copy'))
    .then(() => {
      fs.readdir(path.join(__dirname, 'files-copy')).then((data) => {
        data.forEach((file) => {
          fs.unlink(path.join(__dirname, 'files-copy', file));
        });
      });
    })
    .catch(() => {
      fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true });
    });

  await fs.readdir(path.join(__dirname, 'files')).then((data) => {
    data.forEach((file) => {
      fs.copyFile(
        path.join(__dirname, 'files', file),
        path.join(__dirname, 'files-copy', file)
      );
    });
  });
}

copyDir();
