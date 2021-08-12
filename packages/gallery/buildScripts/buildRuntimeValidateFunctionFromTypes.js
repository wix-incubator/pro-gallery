const path = require("path");
const fs = require("fs");

const { transformSync } =require("@babel/core")
const Ajv = require("ajv")

const getSchemaFromTypes = require('./generateJSONSchemaFromTypes')

function writeES5StandaloneValidateMethod() {
  const moduleCode = buildValidationFunction(getSchemaFromTypes())
  const {code} = transformSync(moduleCode, {});
  const es5CompatibleCode = `/* eslint-disable */ ${code} /* eslint-enable */`
  const typeValidatorDir = path.join(__dirname, '../src/components/gallery/typeValidator')
  fs.writeFileSync(path.join(typeValidatorDir,'/standaloneValidateCode.js'), es5CompatibleCode, {encoding: 'utf-8'})
}

function buildValidationFunction(schema) {
  const ajv = new Ajv({messages: true, verbose: true, code: {source: true, es5: true}})
  const standaloneCode = require("ajv/dist/standalone").default
  ajv.addSchema(schema, 'testSchema')
  const validate = ajv.compile(schema, 'testSchema')
  let moduleCode = standaloneCode(ajv, validate)
  return moduleCode
}

writeES5StandaloneValidateMethod()
