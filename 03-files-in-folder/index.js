const fs = require('fs/promises');
const path = require('path');

const folder = path.join(__dirname, 'secret-folder');

async function readFolder(folder) {
  try {
    const files = await fs.readdir(folder, { withFileTypes: true });
    files.forEach((file) => {
      if (file.isFile()) {
        readStat(file);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}

async function readStat(file) {
  const name = file.name.split('.');
  const ext = path.extname(file.name).slice(1);
  try {
    const stats = await fs.stat(path.join(folder, file.name));
    console.log(`${name[0]} - ${ext} - ${stats.size}b`);
  } catch (error) {
    console.log(error.message);
  }
}

readFolder(folder);
