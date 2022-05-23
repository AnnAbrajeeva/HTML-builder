const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');

async function copyDir(from, to) {
  await clearAssetsFolder(to);
  await fsPromises.mkdir(to, { recursive: true });
  

  try {
    const files = await fsPromises.readdir(from);
    for (let file of files) {
      const stats = await fsPromises.stat(path.join(from, file));
      if (stats.isDirectory()) {
        copyDir(path.join(from, file), path.join(to, file));
      } else {
        fsPromises.copyFile(path.join(from, file), path.join(to, file));
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function clearAssetsFolder(folder) {
  await fsPromises
    .access(folder)
    .then(() => {
      fs.readdir(path.join(folder), { withFileTypes: true }, (err, data) => {
        if (err) console.log(err);
        data.forEach((file) => {
          if (file.isFile()) {
            fsPromises.unlink(path.join(folder, file.name));
          } else {
            clearAssetsFolder(path.join(folder, file.name));
          }
        });
      });
    })
    .catch((err) => {
      if (err) return;
    });
}

const output = path.join(__dirname, 'files');
const input = path.join(__dirname, 'files-copy');

copyDir(output, input);
