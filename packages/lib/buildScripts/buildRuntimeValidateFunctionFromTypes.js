const path = require('path');
const fs = require('fs');

const writeES5StandaloneValidateMethod = require('./writeStandaloneValidate');
const getSchemaFromTypes = require('./getSchema');
const getStyleParamsMap = require('./getStyleParamsMap');

function start() {
  const libSrcFolder = path.join(__dirname, '../src');
  const galleryFolder = path.join(libSrcFolder, 'common/interfaces');
  const sourceTypesFile = path.join(galleryFolder, 'galleryTypes.ts');
  const tempFile = path.join(__dirname, 'temp.js');
  const targetDir = path.join(__dirname, '../src/common/validateTypes/');
  const targetFile = path.join(targetDir, 'standaloneValidateCode.js');

  [sourceTypesFile, targetDir].forEach(raiseIfNotExist);

  const schema = getSchemaFromTypes(sourceTypesFile);

  writeES5StandaloneValidateMethod({
    schema,
    targetFile,
    tempFile,
    writeFileSync: fs.writeFileSync,
    createWriteStream: fs.createWriteStream,
    rmSync: fs.rmSync,
  });

  const styleParamsMap = getStyleParamsMap(schema);
  const mapCode = `export default ${JSON.stringify(styleParamsMap, null, 4)}`;
  fs.writeFileSync(
    path.join(libSrcFolder, 'core/helpers/styleParamsMap.js'),
    mapCode
  );
}
start();

function raiseIfNotExist(fileOrDirPath) {
  if (fs.existsSync(fileOrDirPath) === false)
    throw new Error(
      `Cannot generate validate function. this path does not exist: ${fileOrDirPath}`
    );
}
