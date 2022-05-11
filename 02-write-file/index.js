const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const readline = require('readline');

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const readText = readline.createInterface(stdin, stdout);
readText.write('Please, write something here \n');
readText.on('line', (text) => {
  writeStream.write(text + '\n');
  if(text === 'exit') {
    readText.close();
  }
});

readText.on('close', () => {
  console.log('Bye!');
});
