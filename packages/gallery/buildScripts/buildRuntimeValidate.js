const Ajv = require("ajv") // version >= v7.0.0
// import Ajv from "ajv" // version >= v7.0.0
const ajv = new Ajv({messages: true, verbose: true, code: {source: true}}) // this option is required to generate standalone code
const standaloneCode = require("ajv/dist/standalone").default

const schema = {
  $id: "https://example.com/object.json",
  type: "object",
  properties: {
    foo: {
      type: "string",
      pattern: "^[a-z]+$",
    },
  },
}
ajv.addSchema(schema, 'testSchema')

// 1. generate module with a single default export (CommonJS and ESM compatible):
const validate = ajv.compile(schema, 'testSchema')
ajv.errorsText(validate.errors)

let moduleCode = standaloneCode(ajv, validate)

// 2. pass map of schema IDs to generate multiple exports,
// it avoids code duplication if schemas are mutually recursive or have some share elements:
// let moduleCode = standaloneCode(ajv, {
//   validateObject: "https://example.com/object.json",
// })

// // 3. or generate module with all schemas added to the instance (excluding meta-schemas),
// // export names would use schema IDs (or keys passed to addSchema method):
// let moduleCode = standaloneCode(ajv)

// now you can
// write module code to file
// const fs = require("fs")
// const path = require("path")
// fs.writeFileSync(path.join(__dirname, "/validate.js"), moduleCode)

// ... or require module from string
const requireFromString = require("require-from-string")
const standaloneValidate = requireFromString(moduleCode) // for a single default export


const valid = standaloneValidate({foo: 5})
console.log(valid)
console.log(standaloneValidate.errors)
