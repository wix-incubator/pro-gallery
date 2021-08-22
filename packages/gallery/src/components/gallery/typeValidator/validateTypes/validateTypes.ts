export default validate;
const validateFunc = require('./standaloneValidateCode'); //eslint-disable-line
function validate(data?: any): Record<string, unknown>[] {
  validateFunc(data);
  return validateFunc.errors || [];
}
