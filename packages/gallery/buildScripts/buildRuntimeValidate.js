const path = require("path");
const fs = require("fs");

const { transformSync } =require("@babel/core")
const Ajv = require("ajv") // version >= v7.0.0

const getSchema = require('./generateJSONSchemaFromTypes')
function buildValidationFunction(schema) {
  const ajv = new Ajv({messages: true, verbose: true, code: {source: true, es5: true}})
  const standaloneCode = require("ajv/dist/standalone").default
  ajv.addSchema(schema, 'testSchema')
  const validate = ajv.compile(schema, 'testSchema')
  let moduleCode = standaloneCode(ajv, validate)
  return moduleCode
}

function writeES5StandaloneValidateMethod() {
  const moduleCode = buildValidationFunction(getSchema())
  const {code} = transformSync(moduleCode, {});
  const typeValidatorDir = path.join(__dirname, '../src/components/gallery/typeValidator')
  fs.writeFileSync(path.join(typeValidatorDir,'/standaloneValidateCode.js'), code, {encoding: 'utf-8'})
}

writeES5StandaloneValidateMethod()
