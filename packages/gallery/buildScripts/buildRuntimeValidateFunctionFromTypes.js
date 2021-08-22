const path = require('path');
const browserify = require('browserify');
const fs = require('fs');
const Ajv = require('ajv');

const getSchemaFromTypes = require('./generateJSONSchemaFromTypes');

function writeES5StandaloneValidateMethod() {
  const galleryFolder = path.join(__dirname, '../src/components/gallery');
  const typesFileAbsolutePath = path.join(galleryFolder, 'styles.d.ts');
  const code = buildValidationFunction(
    getSchemaFromTypes(typesFileAbsolutePath)
  );
  const tempFilePath = path.join(__dirname, 'temp.js');
  fs.writeFileSync(tempFilePath, `module.exports=${code}`);
  const standaloneValidateCodePath = path.join(
    galleryFolder,
    'typeValidator/standaloneValidateCode.js'
  );
  const browserifyBundle = standaloneValidateCodePath;
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

writeES5StandaloneValidateMethod();
