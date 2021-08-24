module.exports = writeES5StandaloneValidateMethod;

const TJS = require('typescript-json-schema');
const browserify = require('browserify');
const Ajv = require('ajv');

function writeES5StandaloneValidateMethod({
  sourceTypesFile,
  targetFile,
  tempFile,
  writeFileSync,
  createWriteStream,
  rmSync,
}) {
  const schema = getSchemaFromTypes(sourceTypesFile);
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
