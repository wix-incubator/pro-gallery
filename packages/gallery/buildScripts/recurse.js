const path = require('path');
const fs = require('fs');

const _ = require('lodash');
const { assignByString } = require('pro-gallery-lib');

let final = {};
let route = [];

function build(schema) {
  const properties = schema.properties;
  _.forEach(properties, (refObj, key) => {
    traverse(schema, refObj.$ref, key);
  });
}

function traverse(schema, refName, key) {
  // console.log(`key: ${key}`)
  route.push(key);
  // console.log(route)

  const obj = schema.definitions[refName.split('#/definitions/').pop()];
  if (_.isUndefined(obj.properties)) buildObject();
  else {
    _.forEach(obj.properties, (refObj, key) =>
      traverse(schema, refObj.$ref, key)
    );
  }
}

function buildObject() {
  const routeString = route.join('_');
  final = Object.assign({}, assignByString(final, routeString, routeString));
  route = [];
}

const schema = fs.readFileSync(path.join(__dirname, 'schema.json'), {
  encoding: 'utf8',
});
build(JSON.parse(schema));
console.log(final);
