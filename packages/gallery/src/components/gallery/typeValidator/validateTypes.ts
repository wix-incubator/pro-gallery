import Ajv from 'ajv';

import schema from './schema';

import typeErrorsUI from './typeErrorsUI';
import { StyleParams } from '../styles.d';

function validate(data?: StyleParams) {
  const ajv = new Ajv({ code: { es5: true } }); // options can be passed, e.g. {allErrors: true}
  const validateFunc = ajv.compile(schema);
  validateFunc(data);
  return validateFunc.errors || [];
}
export { validate, typeErrorsUI };
