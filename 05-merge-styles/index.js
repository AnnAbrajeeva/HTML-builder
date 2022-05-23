const path = require('path');
const fs = require('fs');
const fsPromise = require('fs/promises');

const from = path.join(__dirname, 'styles');
const to = path.join(__dirname, 'project-dist/bundle.css');

async function joinCss(from, to) {
  try {
    const writeStream = fs.createWriteStream(to);
    const data = await fsPromise.readdir(from, { withFileTypes: true });
    for(let file of data) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const stream = fs.createReadStream(path.join(from, file.name), 'utf-8');
        stream.on('data', (chunk) => {
          writeStream.write(`${chunk}\n`);
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
}

joinCss(from, to);

