const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

async function readFileTemplate() {
  let temp;
  await fs.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8',
    (err, data) => {
      if (err) throw err;
      readComponents(data);
    }
  );
  return temp;
}

function readComponents(temp) {
  fs.readdir(
    path.join(__dirname, 'components'),
    { withFileTypes: true },
    (err, data) => {
      if (err) throw err;
      data.forEach((file) => {
        if (file.isFile() && path.extname(file.name) === '.html') {
          fs.readFile(
            path.join(__dirname, 'components', file.name),
            'utf-8',
            (err, data) => {
              if (err) throw err;
              const name = file.name.split('.');
              const reg = `{{${name[0]}}}`;
              temp = temp.replace(reg, data);
              const target = path.join(__dirname, 'project-dist/index.html');
              fs.writeFile(target, temp, (err) => {
                if (err) throw err;
              });
            }
          );
        }
      });
    }
  );
}

async function joinCss() {
  let allStyles = '';
  fs.readdir(
    path.join(__dirname, 'styles'),
    { withFileTypes: true },
    (err, data) => {
      if (err) console.log(err.message);
      data.forEach((file) => {
        const writeStream = fs.createWriteStream(
          path.join(__dirname, 'project-dist/style.css')
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

async function createFolder() {
  await fsPromises.mkdir(path.join(__dirname, 'project-dist'), {
    recursive: true,
  });
}

async function copyDir(from, to) {
  await fsPromises.mkdir(to, { recursive: true });

  await fsPromises.readdir(from).then((data) => {
    data.forEach((file) => {
      fs.stat(path.join(from, file), (err, stat) => {
        if (err) throw err;
        if (stat.isDirectory()) {
          copyDir(path.join(from, file), path.join(to, file));
        } else {
          fs.copyFile(path.join(from, file), path.join(to, file), (err) => {
            if (err) console.log(err);
          });
        }
      });
    });
  });
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
    .catch((err) => console.log(err));
}

async function createAllProject() {
  await createFolder();
  readFileTemplate();
  joinCss();
  clearAssetsFolder(path.join(__dirname, 'project-dist/assets'));
  copyDir(
    path.join(__dirname, 'assets'),
    path.join(__dirname, 'project-dist/assets')
  );
}

createAllProject();
