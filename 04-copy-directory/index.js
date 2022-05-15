const path = require('path');
const fs = require('fs/promises');

async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });

  try {
    const files = await fs.readdir(from);
    for (let file of files) {
      const stats = await fs.stat(path.join(from, file));
      if (stats.isDirectory()) {
        copyDir(path.join(from, file), path.join(to, file));
      } else {
        fs.copyFile(path.join(from, file), path.join(to, file));
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

const output = path.join(__dirname, 'files');
const input = path.join(__dirname, 'files-copy');

copyDir(output, input);
