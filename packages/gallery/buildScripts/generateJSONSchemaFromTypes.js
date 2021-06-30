const path = require("path");
const fs = require("fs");

const TJS = require("typescript-json-schema")

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
  [path.join(__dirname, '../src/components/gallery/gallery.d.ts')],
  compilerOptions,
  // basePath
);

// We can either get the schema for one file and one type...
const schema = TJS.generateSchema(program, "StyleParams", settings);
const schemaJSON = JSON.stringify(schema, null, 4)
const template = `export default ${schemaJSON}`
fs.writeFileSync(path.join(__dirname, '../src/components/gallery/proGallery/schema.js'), template, {encoding: 'utf-8'})

// // ... or a generator that lets us incrementally get more schemas

// const generator = TJS.buildGenerator(program, settings);

// // generator can be also reused to speed up generating the schema if usecase allows:
// const schemaWithReusedGenerator = TJS.generateSchema(program, "MyType", settings, [], generator);

// // all symbols
// const symbols = generator.getUserSymbols();

// // Get symbols for different types from generator.
// generator.getSchemaForSymbol("MyType");
// generator.getSchemaForSymbol("AnotherType");


