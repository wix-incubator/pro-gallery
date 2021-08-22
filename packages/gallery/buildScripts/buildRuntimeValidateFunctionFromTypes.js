const path = require('path');
const fs = require('fs');

const writeES5StandaloneValidateMethod = require('./writeStandaloneValidate');
function start() {
  const galleryFolder = path.join(__dirname, '../src/components/gallery');
  const sourceTypesFile = path.join(galleryFolder, 'galleryTypes.ts');
  const tempFile = path.join(__dirname, 'temp.js');
  const targetFile = path.join(
    galleryFolder,
    'typeValidator/validateTypes/standaloneValidateCode.js'
  );
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
