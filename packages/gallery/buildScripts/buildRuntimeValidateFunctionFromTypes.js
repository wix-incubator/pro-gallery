const path = require('path');
var browserify = require('browserify');
// import browserify from 'browserify'
const fs = require('fs');
// const { execSync } = require('child_process');

// const { transformSync } =require("@babel/core")
const Ajv = require('ajv');

const getSchemaFromTypes = require('./generateJSONSchemaFromTypes');

function writeES5StandaloneValidateMethod() {
  const moduleCode = buildValidationFunction(getSchemaFromTypes());
  // const {code} = transformSync(moduleCode, {});
  // const es5CompatibleCode = `/* eslint-disable */ ${code} /* eslint-enable */`
  const tempFilePath = path.join(__dirname, 'temp.js');
  fs.writeFileSync(tempFilePath, `module.exports=${moduleCode}`);
  // fs.writeFileSync(tempFilePath, moduleCode)
  const typeValidatorDir = path.join(
    __dirname,
    '../src/components/gallery/typeValidator'
  );
  const standaloneValidateCodePath = path.join(
    typeValidatorDir,
    '/standaloneValidateCode.js'
  );
  // fs.writeFileSync(standaloneValidateCodePath, `module.exports=${moduleCode}`)
  // const browserifyBundle = path.join(typeValidatorDir,'/browserify.js')
  const browserifyBundle = standaloneValidateCodePath;
  browserify(tempFilePath, { standalone: 'nirnaor' })
    .transform('babelify', { global: true, presets: ['@babel/preset-env'] })
    .bundle()
    .pipe(fs.createWriteStream(browserifyBundle));

  // execSync(
  //   `node node_modules/.bin/browserify -t [ babelify --presets [ @babel/preset-env ] ] --standalone nirnaor ${tempFilePath} > ${browserifyBundle}`
  // );
  // fs.writeFileSync(standaloneValidateCodePath, moduleCode, {encoding: 'utf-8'})
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
