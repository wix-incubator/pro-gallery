export { validateTypes };
const validateFunc = require('./standaloneValidateCode'); //eslint-disable-line
function validateTypes(data?: any): Record<string, unknown>[] {
  validateFunc(data);
  return validateFunc.errors || [];
}
