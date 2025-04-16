module.exports = writeES5StandaloneValidateMethod;

const browserify = require('browserify');
const Ajv = require('ajv');

function writeES5StandaloneValidateMethod({ schema, targetFile, tempFile, writeFileSync, createWriteStream, rmSync }) {
  const code = buildValidationFunction(schema);
  writeFileSync(tempFile, code);
  const fileWriter = createWriteStream(targetFile);
  browserify(tempFile, { standalone: 'nirnaor' })
    .transform('babelify', { global: true, presets: ['@babel/preset-env'] })
    .bundle()
    .pipe(fileWriter);

  fileWriter.on('finish', function () {
    console.log('finished writing the browserify file');
    rmSync(tempFile);
  });
}

function buildValidationFunction(schema) {
  const ajv = new Ajv({
    messages: true,
    allErrors: true,
    verbose: true,
    code: { source: true, es5: true },
  });
  const standaloneCode = require('ajv/dist/standalone').default;
  ajv.addSchema(schema, 'testSchema');
  const validate = ajv.compile(schema, 'testSchema');
  let moduleCode = standaloneCode(ajv, validate);
  return moduleCode;
}
