const fs = require('fs')
const path = require('path')

const { Layouter } = require('../dist/cjs/index')

function readJsonFromDir(name) {
  const text = fs.readFileSync(path.join(__dirname, name), 'utf-8');
  const args = JSON.parse(text.trim());
  return args;
}



function createStructure(layoutParams) {
    layoutParams.options.createLayoutOnInit = false; // TODO - what does this do?
    const layouter = new Layouter(layoutParams); // TODO - no need for "this."
    // const result =  layouter.createLayout(layoutParams);
    // return result
}

const lp = readJsonFromDir('layoutParams.json')
createStructure(lp)
