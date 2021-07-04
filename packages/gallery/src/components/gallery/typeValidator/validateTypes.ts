import Ajv from 'ajv';

import schema from './schema';

import typeErrorsUI from './typeErrorsUI';

function validate(data: any) {
  const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
  const validateFunc = ajv.compile(schema);
  validateFunc(data);
  return validateFunc.errors || [];
}
export { validate, typeErrorsUI };
