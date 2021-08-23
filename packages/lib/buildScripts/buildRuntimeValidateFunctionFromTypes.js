const path = require('path');
const fs = require('fs');

const writeES5StandaloneValidateMethod = require('./writeStandaloneValidate');
function start() {
  const galleryFolder = path.join(
    __dirname,
    '../../gallery/src/components/gallery'
  );
  const sourceTypesFile = path.join(galleryFolder, 'galleryTypes.ts');
  const tempFile = path.join(__dirname, 'temp.js');
  const targetFile = path.join(
    __dirname,
    '../src/common/validateTypes/standaloneValidateCode.js'
  );

  [sourceTypesFile, targetFile].forEach(raiseIfNotExist);

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
