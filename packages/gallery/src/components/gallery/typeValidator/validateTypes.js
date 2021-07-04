import Ajv from 'ajv';

import schema from './schema';
import typeErrorsUI from './typeErrorsUI';

function validate(data) {
  const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
  const validate = ajv.compile(schema);
  validate(data);
  return validate.errors || [];
}

export default { validate, typeErrorsUI };
