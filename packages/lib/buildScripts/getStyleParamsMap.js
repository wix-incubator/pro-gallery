module.exports = getStyleParamsMap;

const _ = require('lodash');

function getStyleParamsMap(schema) {
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
