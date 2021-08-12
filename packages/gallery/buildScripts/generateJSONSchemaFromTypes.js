module.exports = getSchema
const path = require("path");
const fs = require("fs");

const TJS = require("typescript-json-schema")
function getSchema() {
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
    [path.join(__dirname, '../src/components/gallery/styles.d.ts')],
    compilerOptions,
    // basePath
  );

  // We can either get the schema for one file and one type...
  const schema = TJS.generateSchema(program, "StyleParams", settings);
  return schema
}
// const schema = getSchema()
// const schemaJSON = JSON.stringify(schema, null, 4)
// const template = `export default ${schemaJSON}`
// const typeValidatorDir = path.join(__dirname, '../src/components/gallery/typeValidator')
// fs.writeFileSync(path.join(typeValidatorDir,'/schema.js'), template, {encoding: 'utf-8'})
