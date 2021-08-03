export function assignByString(
  Obj: object,
  string: string,
  value: string | boolean | number
): object {
  let _obj: object = { ...Obj };
  let keyArr: string[] = string.split('_');
  let assignedProperty: string = keyArr.pop()!;
  let pointer = _obj;
  keyArr.forEach((key) => {
    if (!pointer[key]) pointer[key] = {};
    pointer = pointer[key];
  });
  pointer[assignedProperty] = value;
  return _obj;
}

export function flattenObject(ob: object): object {
  var toReturn: object = {};

  for (var i in ob) {
    // eslint-disable-next-line no-prototype-builtins
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == 'object' && ob[i] !== null) {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        // eslint-disable-next-line no-prototype-builtins
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + '.' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}
