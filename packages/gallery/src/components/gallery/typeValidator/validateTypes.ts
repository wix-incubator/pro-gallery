import typeErrorsUI from './typeErrorsUI';
import { StyleParams } from 'pro-gallery-lib';
const validateFunc = require('./standaloneValidateCode'); //eslint-disable-line

function validate(data?: StyleParams): Record<string, unknown>[] {
  validateFunc(data);
  return validateFunc.errors || [];
}
export { validate, typeErrorsUI };
