module.exports = getSchemaFromTypes;

const TJS = require('typescript-json-schema');
function getSchemaFromTypes(rootTypesFile) {
  // optionally pass argument to schema generator
  const settings = {
    required: true,
  };

  // optionally pass ts compiler options
  const compilerOptions = {
    strictNullChecks: true,
  };

  // optionally pass a base path
  // const basePath = "./my-dir";

  const program = TJS.getProgramFromFiles(
    [rootTypesFile],
    compilerOptions
    // basePath
  );

  // We can either get the schema for one file and one type...
  const schema = TJS.generateSchema(program, 'StyleParams', settings);
  return schema;
}
