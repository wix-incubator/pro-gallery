const TJS = require('typescript-json-schema');
const path = require('path');
const browserify = require('browserify');
const fs = require('fs');
const Ajv = require('ajv');

function writeES5StandaloneValidateMethod({
  sourceTypesFile,
  targetFile,
  tempFile,
}) {
  const code = buildValidationFunction(getSchemaFromTypes(sourceTypesFile));
  fs.writeFileSync(tempFile, code);
  const fileWriter = fs.createWriteStream(targetFile);
  browserify(tempFile, { standalone: 'nirnaor' })
    .transform('babelify', { global: true, presets: ['@babel/preset-env'] })
    .bundle()
    .pipe(fileWriter);

  fileWriter.on('finish', function () {
    console.log('finished writing the browserify file');
    fs.rmSync(tempFile);
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

function getSchemaFromTypes(typesFileAbsolutePath) {
  // optionally pass argument to schema generator
  const settings = {
    required: true,
  };

  // optionally pass ts compiler options
  const compilerOptions = {
    strictNullChecks: true,
  };

  // optionally pass a base path
  // const basePath = "./my-dir";

  const program = TJS.getProgramFromFiles(
    [typesFileAbsolutePath],
    compilerOptions
    // basePath
  );

  // We can either get the schema for one file and one type...
  const schema = TJS.generateSchema(program, 'StyleParams', settings);
  return schema;
}

const galleryFolder = path.join(__dirname, '../src/components/gallery');
const sourceTypesFile = path.join(galleryFolder, 'galleryTypes.ts');
const tempFile = path.join(__dirname, 'temp.js');
const targetFile = path.join(
  galleryFolder,
  'typeValidator/standaloneValidateCode.js'
);
writeES5StandaloneValidateMethod({ sourceTypesFile, targetFile, tempFile });
