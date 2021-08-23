const path = require('path');
const fs = require('fs');

const writeES5StandaloneValidateMethod = require('./writeStandaloneValidate');
function start() {
  const galleryFolder = path.join(
    __dirname,
    '../../gallery/src/common/interfaces'
  );
  const sourceTypesFile = path.join(galleryFolder, 'galleryTypes.ts');
  const tempFile = path.join(__dirname, 'temp.js');
  const targetDir = path.join(__dirname, '../src/common/validateTypes/');
  const targetFile = path.join(targetDir, 'standaloneValidateCode.js');

  [sourceTypesFile, targetDir].forEach(raiseIfNotExist);

  writeES5StandaloneValidateMethod({
    sourceTypesFile,
    targetFile,
    tempFile,
    writeFileSync: fs.writeFileSync,
    createWriteStream: fs.createWriteStream,
    rmSync: fs.rmSync,
  });
}
start();

function raiseIfNotExist(fileOrDirPath) {
  if (fs.existsSync(fileOrDirPath) === false)
    throw new Error(
      `Cannot generate validate function. this path does not exist: ${fileOrDirPath}`
    );
}
