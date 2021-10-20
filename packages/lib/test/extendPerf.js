const fs = require('fs');
const path = require('path');

const {
  extendNestedOptionsToIncludeOldAndNew,
} = require('../dist/cjs/core/helpers/optionsConverter')

function readJsonFromDir(name) {
  const text = fs.readFileSync(path.join(__dirname, name), 'utf-8');
  const args = JSON.parse(text.trim());
  return args;
}
const styleParams = readJsonFromDir('styleParams.json')
extendNestedOptionsToIncludeOldAndNew(styleParams)
