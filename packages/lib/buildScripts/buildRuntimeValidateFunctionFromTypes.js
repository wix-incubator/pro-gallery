const path = require('path');
const fs = require('fs');

const writeES5StandaloneValidateMethod = require('./writeStandaloneValidate');
const getSchemaFromTypes = require('./getSchema');
const getOptionsMap = require('./getOptionsMap');

function start() {
  const libSrcFolder = path.join(__dirname, '../src');
  const galleryFolder = path.join(libSrcFolder, 'common/interfaces');
  const sourceTypesFile = path.join(galleryFolder, 'galleryTypes.ts');
  const tempFile = path.join(__dirname, 'temp.js');
  const targetDir = path.join(__dirname, '../src/common/validateTypes/');
  const targetFile = path.join(targetDir, 'standaloneValidateCode.js');

  [sourceTypesFile, targetDir].forEach(raiseIfNotExist);

  const schema = getSchemaFromTypes(sourceTypesFile);
  // fs.writeFileSync(
  //   path.join(libSrcFolder, 'schema.json'),
  //   JSON.stringify(schema, null, 4)
  // )

  writeES5StandaloneValidateMethod({
    schema,
    targetFile,
    tempFile,
    writeFileSync: fs.writeFileSync,
    createWriteStream: fs.createWriteStream,
    rmSync: fs.rmSync,
  });

  const optionsMap = getOptionsMap(schema);
  const mapCode = `export default ${JSON.stringify(optionsMap, null, 4)}`;
  fs.writeFileSync(path.join(libSrcFolder, 'core/helpers/optionsMap.js'), mapCode);
}
start();

function raiseIfNotExist(fileOrDirPath) {
  if (fs.existsSync(fileOrDirPath) === false)
    throw new Error(`Cannot generate validate function. this path does not exist: ${fileOrDirPath}`);
}
