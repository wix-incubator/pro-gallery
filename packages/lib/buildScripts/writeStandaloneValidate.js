module.exports = writeES5StandaloneValidateMethod;

const Ajv = require('ajv');

function writeES5StandaloneValidateMethod({ schema, targetFile, writeFileSync }) {
  const code = buildValidationFunction(schema);
  writeFileSync(targetFile, code);
}

function buildValidationFunction(schema) {
  const ajv = new Ajv({
    messages: true,
    allErrors: true,
    verbose: true,
    code: { source: true, esm: true },
  });
  const standaloneCode = require('ajv/dist/standalone').default;
  ajv.addSchema(schema, 'testSchema');
  const validate = ajv.compile(schema, 'testSchema');
  let moduleCode = standaloneCode(ajv, validate);
  return moduleCode;
}
