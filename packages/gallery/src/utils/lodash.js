export const pick = (obj, keys) => {
  const res = {};
  Object.entries(obj).forEach(([key, val]) => {
    if (keys.indexOf(key) >= 0) {
      res[key] = val;
    }
  });
  return res;
};

export const throttle = (callback, limit) => {
  let wait = false; // Initially, we're not waiting
  return () => { // We return a throttled function
    if (!wait) { // If we're not waiting
      callback.call(); // Execute users function
      wait = true; // Prevent future invocations
      setTimeout(() => { // After a period of time
        wait = false; // And allow future invocations
      }, limit);
    }
  }
}

//   find: () => {},
//   get: () => {},
//   isUndefined: () => {},
//   isNaN: () => {},
//   clone: () => {},
// }
