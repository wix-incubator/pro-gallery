module.exports = getStyleParamsMap;

const _ = require('lodash');

let final = {};
function getStyleParamsMap(schema) {
  traverseProperties(schema.properties, schema, []);
  return 'nir';
}

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
    // console.log(`leaf: ${key}. route: ${route}`)
    // final = Object.assign({}, assignByString(final, routeString, routeString));
    const routeString = route.join('_');
    final = assignByString(final, routeString, routeString);
  }
  // if(key === 'density') {
  //   console.log(final)
  //   throw new Error('bye')
  // }
}
//   try {
//     traverse(refObj.$ref, key, route);
//   } catch (e) {
//     console.log(`error with key: ${key}`);
//     console.error(e);
//     throw e;
//   }
// });

// function traverse(refName, key, route) {
//   console.log(arguments)
//   // route.push(key);
//   // if (!refName) {
//   //   buildObject(route);
//   //   return;
//   // }

//   // const obj = schema.definitions[refName.split('#/definitions/').pop()];
//   // const layoutParams = schema.definitions.LayoutParams
//   // console.log(layoutParams)
//   // // if (_.isUndefined(obj.properties) || _.isUndefined(refName)) {
//   // //   buildObject(route);
//   // // }
//   // // else {
//   // //   _.forEach(obj.properties, (refObj, key) => traverse(refObj.$ref, key, route));
//   // //   route = []
//   // // }
// // }

// }

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
getStyleParamsMap(s);
console.log(JSON.stringify(final, null, 4));
