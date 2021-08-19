const path = require('path');
const fs = require('fs');

const _ = require('lodash');
const { assignByString } = require('pro-gallery-lib');

function build(schema) {
  let final = {};
  let route = [];
  const properties = schema.properties;
  _.forEach(properties, (refObj, key) => {
    try {
      traverse(refObj.$ref, key);
    } catch (e) {
      console.log(`error with key: ${key}`);
      console.error(e);
      throw e;
    }
  });

  function traverse(refName, key) {
    // console.log(`key: ${key}`)
    route.push(key);
    if (!refName) {
      buildObject();
      return;
    }
    // console.log(route)

    const obj = schema.definitions[refName.split('#/definitions/').pop()];
    if (_.isUndefined(obj.properties) || _.isUndefined(refName)) buildObject();
    else {
      _.forEach(obj.properties, (refObj, key) => traverse(refObj.$ref, key));
    }
  }

  function buildObject() {
    const routeString = route.join('_');
    final = Object.assign({}, assignByString(final, routeString, routeString));
    route = [];
  }

  return final;
}

const schema = fs.readFileSync(path.join(__dirname, 'schema.json'), {
  encoding: 'utf8',
});
const result = build(JSON.parse(schema));
fs.writeFileSync('schemaKeys.json', JSON.stringify(result, null, 4));
