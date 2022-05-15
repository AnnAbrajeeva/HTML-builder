const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const readline = require('readline');

const file = path.join(__dirname, 'text.txt');

async function readAndWrite(file) {
  const writeStream = fs.createWriteStream(file);
  const readText = readline.createInterface(stdin, stdout);
  await question();
 
  readText.on('close', () => {
    console.log('\nBye!');
  });

  async function question() {
    readText.question('Please, type something here ', (answer) => {
      if (answer !== 'exit') {
        writeStream.write(answer + '\n');
        question();
      } else {
        readText.close();
        return;
      }
    });
  }
}

readAndWrite(file);
