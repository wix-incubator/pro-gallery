module.exports = getSchemaFromTypes;

const TJS = require('typescript-json-schema');
const path = require('path');

function getSchemaFromTypes(typesFileAbsolutePath) {
  // optionally pass argument to schema generator
  const settings = {
    required: true,
  };

  const program = TJS.programFromConfig(
    path.join(__dirname, '..', 'tsconfig.json'),
    [typesFileAbsolutePath]
  );

  const generator = TJS.buildGenerator(program, settings);
  const schema = TJS.generateSchema(
    program,
    'Options',
    settings,
    [],
    generator
  );
  return schema;
}
