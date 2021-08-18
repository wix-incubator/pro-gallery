import typeErrorsUI from './typeErrorsUI';
import { StyleParams } from '../styles.d';
const validateFunc = require('./standaloneValidateCode'); //eslint-disable-line

function validate(data?: StyleParams): Record<string, unknown>[] {
  validateFunc(data);
  return validateFunc.errors || [];
}
export { validate, typeErrorsUI };
