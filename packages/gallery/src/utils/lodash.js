export const pick = (obj, keys) => {
  const res = {};
  Object.entries(obj).forEach(([key, val]) => {
    if (keys.indexOf(key) >= 0) {
      res[key] = val;
    }
  });
  return res;
};

//   find: () => {},
//   get: () => {},
//   isUndefined: () => {},
//   isNaN: () => {},
//   clone: () => {},
// }
