// or ESM/TypeScript import
// import Ajv from "ajv"
// Node.js require:
const Ajv = require("ajv")

const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
import schema from './schema'

function validate(data) {
	// const path = require('path')
	// const fs = require('fs')
	// const schema = JSON.parse(fs.readFileSync(path.join(__dirname, 'schema.json')))
	const validate = ajv.compile(schema)
	const valid = validate(data)
	return valid ? [] : validate.errors
	// if (!valid) {
	// 	console.log('validation failed')
	// 	console.log(JSON.stringify(validate.errors, null, 4))
	// 	throw new Error(JSON.stringify(validate.errors, null, 4))
	// } else 
	// 	console.log('OKaaaa')

}

export default validate

