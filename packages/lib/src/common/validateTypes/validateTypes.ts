export { validateTypes };
import _validateFunc from './standaloneValidateCode';

const validateFunc = _validateFunc as any;

function validateTypes(data?: any): Record<string, unknown>[] {
  validateFunc(data);
  return validateFunc.errors || [];
}
