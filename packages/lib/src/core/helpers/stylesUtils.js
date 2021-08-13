function assignByString(Obj, string, value) {
  let _obj = { ...Obj };
  let keyArr = string.split('_');
  let assignedProperty = keyArr.pop();
  let pointer = _obj;
  keyArr.forEach((key) => {
    if (!pointer[key]) pointer[key] = {};
    pointer = pointer[key];
  });
  pointer[assignedProperty] = value;
  return _obj;
}

function flattenObject(ob) {
  var toReturn = {};

  for (var i in ob) {
    // eslint-disable-next-line no-prototype-builtins
    if (!ob.hasOwnProperty(i)) continue;

    if (
      typeof ob[i] == 'object' &&
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
  return Object.entries(ob).reduce(
    (obj, [styleParam, value]) => assignByString(obj, styleParam, value),
    {}
  );
}

export { flattenObject, assignByString, flatToNested };
