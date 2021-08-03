const assignByString = (Obj, string, value) => {
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
export {assignByString};
