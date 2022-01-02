function assignByString(Obj, string, value, cloneObject = true) {
  let _obj = cloneObject ? { ...Obj } : Obj;
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
function getByString(Obj, string) {
  let keyArr = string.split('_');
  let assignedProperty = keyArr.pop();
  let pointer = Obj;
  if (
    !keyArr.every((key) => {
      if (typeof pointer[key] !== 'object') return false; //if its not an object there will be nothing in it...
      pointer = pointer[key]; //programatically going town the rabit hole
      return true;
    })
  ) {
    return undefined;
  } else {
    return pointer[assignedProperty];
  }
}

function mutatingAssignMultipleByStrings(Obj, stringValuePairArray) {
  for (let [string, value] of stringValuePairArray) {
    Object.assign(Obj, assignByString(Obj, string, value));
  }
}

function flattenObject(ob) {
  var toReturn = {};

  for (var i in ob) {
    // eslint-disable-next-line no-prototype-builtins
    if (!ob.hasOwnProperty(i)) continue;

    if (
      typeof ob[i] == 'object' &&
      !(ob[i] instanceof Array) &&
      ob[i] !== null &&
      Object.keys(ob[i]).length > 0
    ) {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        // eslint-disable-next-line no-prototype-builtins
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + '_' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}

function flatToNested(ob) {
  const cloneObject = false;
  return Object.entries(ob).reduce(
    (obj, [option, value]) => assignByString(obj, option, value, cloneObject),
    {}
  );
}
function trimUndefinedValues_nested(object) {
  const flatObject = flattenObject(object);
  Object.keys(flatObject).forEach((key) =>
    flatObject[key] === undefined ? delete flatObject[key] : {}
  );
  return flatToNested(flatObject);
}

function mergeNestedObjects(...args) {
  return flatToNested(Object.assign({}, ...args.map(flattenObject)));
}

function trimUndefinedValues_flat(flatObject) {
  Object.keys(flatObject).forEach((key) =>
    flatObject[key] === undefined ? delete flatObject[key] : {}
  );
  return flatObject;
}

export {
  flattenObject,
  assignByString,
  flatToNested,
  mergeNestedObjects,
  getByString,
  mutatingAssignMultipleByStrings,
  trimUndefinedValues_nested,
  trimUndefinedValues_flat,
};
