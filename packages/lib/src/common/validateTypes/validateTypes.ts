import validateFunc from './standaloneValidateCode.js';
export { validateTypes };
function validateTypes(data?: any): Record<string, unknown>[] {
  validateFunc(data);
  // @ts-expect-error
  return validateFunc.errors || [];
}
