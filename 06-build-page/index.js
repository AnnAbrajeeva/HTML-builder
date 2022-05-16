const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

// async function readFileTemplate(file) {
//   let temp;
//   const data = await fsPromises.readFile(file, "utf-8");
//   readComponents(data);
// }

// async function readComponents(componentsFolder, temp, extname) {
//   try {
//     let data = await fsPromises.readdir(
//       componentsFolder,
//     { withFileTypes: true })

//     data.forEach((file) => {
//       if (file.isFile() && path.extname(file.name) === extname) {
//         let file = fs.readFile(
//           path.join(__dirname, "components", file.name),
//           "utf-8",
//       }

//   } catch (error) {

//   }

//       data.forEach((file) => {
//         if (file.isFile() && path.extname(file.name) === ".html") {
//           fs.readFile(
//             path.join(__dirname, "components", file.name),
//             "utf-8",
//             (err, data) => {
//               if (err) throw err;
//               const name = file.name.split(".");
//               const reg = `{{${name[0]}}}`;
//               temp = temp.replace(reg, data);
//               const target = path.join(__dirname, "project-dist/index.html");
//               fs.writeFile(target, temp, (err) => {
//                 if (err) throw err;
//               });
//             }
//           );
//         }
//       });
//     }
//   );
// }

// async function joinCss() {
//   let allStyles = "";
//   fs.readdir(
//     path.join(__dirname, "styles"),
//     { withFileTypes: true },
//     (err, data) => {
//       if (err) console.log(err.message);
//       data.forEach((file) => {
//         const writeStream = fs.createWriteStream(
//           path.join(__dirname, "project-dist/style.css")
//         );
//         if (file.isFile() && path.extname(file.name) === ".css") {
//           const stream = fs.createReadStream(
//             path.join(__dirname, "styles", file.name),
//             "utf-8"
//           );
//           stream.on("data", (chunk) => {
//             allStyles += chunk;
//             writeStream.write(allStyles);
//           });
//         }
//       });
//     }
//   );
// }

async function createFolder() {
  await fsPromises.mkdir(path.join(__dirname, 'project-dist'), {
    recursive: true,
  });
}

// async function createAllProject() {
//   await createFolder();
//   readFileTemplate(tempHtml);
//   joinCss();
//   clearAssetsFolder(path.join(__dirname, "project-dist/assets"));
//   copyDir(
//     path.join(__dirname, "assets"),
//     path.join(__dirname, "project-dist/assets")
//   );
// }

// createAllProject();

const cssFolder = path.join(__dirname, 'styles');
const cssTargetFolder = path.join(__dirname, 'project-dist/style.css');

async function joinCss(from, to) {
  let temp = '';
  try {
    const writeStream = fs.createWriteStream(to);
    const data = await fsPromises.readdir(from, { withFileTypes: true });
    data.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const stream = fs.createReadStream(path.join(from, file.name), 'utf-8');
        stream.on('data', (chunk) => {
          temp += chunk;
          writeStream.write(temp);
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}

const tempHtml = path.join(__dirname, 'template.html');
const htmlComponentsFolder = path.join(__dirname, 'components');
const targetFile = path.join(__dirname, 'project-dist/index.html');

// async function readFileTemplate() {
//   let temp;
//   await fs.readFile(
//     path.join(__dirname, 'template.html'),
//     'utf-8',
//     (err, data) => {
//       if (err) throw err;
//       readComponents(data);
//     }
//   );
//   return temp;
// }

// function readComponents(temp) {
//   fs.readdir(
//     path.join(__dirname, 'components'),
//     { withFileTypes: true },
//     (err, data) => {
//       if (err) throw err;
//       data.forEach((file) => {
//         if (file.isFile() && path.extname(file.name) === '.html') {
//           fs.readFile(
//             path.join(__dirname, 'components', file.name),
//             'utf-8',
//             (err, data) => {
//               if (err) throw err;
//               const name = file.name.split('.');
//               const reg = `{{${name[0]}}}`;
//               temp = temp.replace(reg, data);
//               const target = path.join(__dirname, 'project-dist/index.html');
//               fs.writeFile(target, temp, (err) => {
//                 if (err) throw err;
//               });
//             }
//           );
//         }
//       });
//     }
//   );
// }

async function joinHtml(template, from, to) {
  try {
    let temp = await fsPromises.readFile(template, 'utf-8');
    const data = await fsPromises.readdir(from, { withFileTypes: true });
    for (let file of data) {
      if (file.isFile() && path.extname(file.name) === '.html') {
        fs.readFile(path.join(from, file.name), 'utf-8', (err, data) => {
          if (err) throw err;
          if (data) {
            const name = file.name.split('.');
            const reg = `{{${name[0]}}}`;
            temp = temp.replace(reg, data);
            fs.writeFile(to, temp, (err) => {
              if (err) throw err;
            });
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
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
    .catch((err) => {
      if (err) return;
    });
}

const assetsFolder = path.join(__dirname, 'project-dist/assets');

createFolder();
joinCss(cssFolder, cssTargetFolder);
// readFileTemplate();
joinHtml(tempHtml, htmlComponentsFolder, targetFile);
clearAssetsFolder(assetsFolder);
copyDir(
  path.join(__dirname, 'assets'),
  path.join(__dirname, 'project-dist/assets')
);
