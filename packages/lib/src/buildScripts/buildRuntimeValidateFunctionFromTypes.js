export { writeES5StandaloneValidateMethod };
const path = require('path');
const browserify = require('browserify');
const fs = require('fs');
const Ajv = require('ajv');

const getSchemaFromTypes = require('./generateJSONSchemaFromTypes');

function writeES5StandaloneValidateMethod(rootTypesFile, outputPath) {
  const code = buildValidationFunction(getSchemaFromTypes(rootTypesFile));
  const tempFilePath = path.join(__dirname, 'temp.js');
  fs.writeFileSync(tempFilePath, `module.exports=${code}`);
  const browserifyBundle = outputPath;
  const fileWriter = fs.createWriteStream(browserifyBundle);
  browserify(tempFilePath, { standalone: 'nirnaor' })
    .transform('babelify', { global: true, presets: ['@babel/preset-env'] })
    .bundle()
    .pipe(fileWriter);

  fileWriter.on('finish', function () {
    console.log('finished writing the browserify file');
    fs.rmSync(tempFilePath);
  });
}

function buildValidationFunction(schema) {
  const ajv = new Ajv({
    messages: true,
    verbose: true,
    code: { source: true, es5: true },
  });
  const standaloneCode = require('ajv/dist/standalone').default;
  ajv.addSchema(schema, 'testSchema');
  const validate = ajv.compile(schema, 'testSchema');
  let moduleCode = standaloneCode(ajv, validate);
  return moduleCode;
}
