const path = require('path');
const browserify = require('browserify');
const fs = require('fs');
const Ajv = require('ajv');

const getSchemaFromTypes = require('./generateJSONSchemaFromTypes');

function writeES5StandaloneValidateMethod() {
  const code = buildValidationFunction(getSchemaFromTypes());
  // const moduleCode = `/* eslint-disable */ ${code} /* eslint-enable */`;
  const tempFilePath = path.join(__dirname, 'temp.js');
  fs.writeFileSync(
    tempFilePath,
    `/* eslint-disable */ module.exports=${code}/* eslint-enable */`
  );
  const typeValidatorDir = path.join(
    __dirname,
    '../src/components/gallery/typeValidator'
  );
  const standaloneValidateCodePath = path.join(
    typeValidatorDir,
    '/standaloneValidateCode.js'
  );
  const browserifyBundle = standaloneValidateCodePath;
  browserify(tempFilePath, { standalone: 'nirnaor' })
    .transform('babelify', { global: true, presets: ['@babel/preset-env'] })
    .bundle()
    .pipe(fs.createWriteStream(browserifyBundle));

  fs.rmSync(tempFilePath);
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
