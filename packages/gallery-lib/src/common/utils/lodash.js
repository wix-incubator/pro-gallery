export const pick = (obj, keys) => {
  const res = {};
  Object.entries(obj || {}).forEach(([key, val]) => {
    if (keys.indexOf(key) >= 0) {
      res[key] = val;
    }
  });
  return res;
};

export const throttle = (callback, limit) => {
  let wait = false;
  let callAfterWait = false;
  return (...args) => {
    if (!wait) {
      callAfterWait = false;
      callback.apply(this, args);
      wait = true;
      setTimeout(() => {
        callAfterWait && callback.apply(this, args);
        wait = false;
      }, limit);
    } else {
      callAfterWait = true;
    }
  };
};

export const debounce = (callback, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback.apply(this, args);
    }, wait);
  };
};

export const get = (obj, path, defaultValue) => {
  const result = String.prototype.split
    .call(path, /[,[\].]+?/)
    .filter(Boolean)
    .reduce(
      (res, key) => (res !== null && res !== undefined ? res[key] : res),
      obj,
    );
  return result === undefined || result === obj ? defaultValue : result;
};

export const isFunction = something => typeof something === 'function';

export const isEqual = (obj1, obj2) => {
  try {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  } catch (e) {
    return false;
  }
};

export const isNumber = n => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};
