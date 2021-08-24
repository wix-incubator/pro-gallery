module.exports = getStyleParamsMap;

const _ = require('lodash');

function getStyleParamsMap(schema) {
  let final = {};
  traverseProperties(schema.properties, schema, []);
  return final;

  function traverseProperties(properties, schema, route) {
    for (const [key, value] of Object.entries(properties)) {
      const newRoute = _.clone(route);
      newRoute.push(key);
      traverse(key, value, schema, newRoute);
    }
  }

  function getDef(obj, schema) {
    return schema.definitions[obj.$ref.split('#/definitions/').pop()];
  }

  function traverse(key, obj, schema, route) {
    if (obj.$ref) {
      const def = getDef(obj, schema);
      traverseProperties(def.properties, schema, route);
    } else {
      const routeString = route.join('_');
      final = assignByString(final, routeString, routeString);
    }
  }
}

function assignByString(Obj, string, value) {
  // TODO: Figure out why I cannot import this from pro-gallery-lib
  let _obj = { ...Obj };
  let keyArr = string.split('_');
  let assignedProperty = keyArr.pop();
  let pointer = _obj;
  keyArr.forEach((key) => {
    if (typeof pointer[key] !== 'object') pointer[key] = {}; //if its not an object we put an object over it to allow assignments
    pointer = pointer[key];
  });
  pointer[assignedProperty] = value;
  return _obj;
}

const path = require('path');
const fs = require('fs');
const s = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/schema.json'), {
    encoding: 'utf8',
  })
);
const res = getStyleParamsMap(s);
console.log(JSON.stringify(res, null, 4));
