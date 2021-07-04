import Ajv from 'ajv';

// import schema from './schema';

import typeErrorsUI from './typeErrorsUI';

function validate(data: any) {
  const schema = {
    type: 'object',
    properties: {
      item: {
        $ref: '#/definitions/Item',
      },
    },
    required: ['item'],
    definitions: {
      Item: {
        type: 'object',
        properties: {
          video: {
            $ref: '#/definitions/Video',
          },
        },
        required: ['video'],
      },
      Video: {
        type: 'object',
        properties: {
          playOn: {
            $ref: '#/definitions/PlayOn',
          },
        },
        required: ['playOn'],
      },
      PlayOn: {
        enum: ['auto', 'hover', 'onClick'],
        type: 'string',
      },
    },
    $schema: 'http://json-schema.org/draft-07/schema#',
  };
  const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
  const validateFunc = ajv.compile(schema);
  validateFunc(data);
  return validateFunc.errors || [];
}
export { validate, typeErrorsUI };
// export default { validate, typeErrorsUI };
