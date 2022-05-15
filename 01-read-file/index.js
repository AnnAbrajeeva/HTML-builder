const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'text.txt');

function readFile(file) {
  const stream = fs.ReadStream(file, 'utf-8');
  stream.on('readable', () => {
    const data = stream.read();
    if(data) {
      console.log(data);
    }  
  });

  stream.on('error', (err) => {
    if (err) console.error(err.message);
  });
}

readFile(file);
