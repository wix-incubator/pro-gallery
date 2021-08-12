const path = require("path");
const fs = require("fs");
var babel = require("@babel/core");

// const code = 'const a = 5; console.log(a);'
const code = fs.readFileSync(path.join(__dirname, '../../../node_modules/ajv/dist/ajv.js'))
const options = {};
babel.transform(code, options, function(err, result) {
  const typeValidatorDir = path.join(__dirname, '../src/components/gallery/typeValidator')
  fs.writeFileSync(path.join(typeValidatorDir, 'ajvEs5.js'), result.code)
  console.log('wrote AJV es5 compatible code')
});

