export default {
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
