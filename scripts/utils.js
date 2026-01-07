/**
 * Native replacements for lodash functions
 */

/**
 * Gets the value at path of object. If the resolved value is undefined, the defaultValue is returned.
 * Supports dot notation and bracket notation (e.g., 'a.b.c' or 'a[0].b')
 * @param {Object} obj - The object to query
 * @param {string|Array} path - The path of the property to get
 * @param {*} defaultValue - The value returned if the resolved value is undefined
 * @returns {*} Returns the resolved value
 */
function get(obj, path, defaultValue) {
  if (obj == null) return defaultValue;
  
  const keys = Array.isArray(path) 
    ? path 
    : path.replace(/\[(\d+)\]/g, '.$1').split('.');
  
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) return defaultValue;
  }
  return result;
}

/**
 * Creates a function that memoizes the result of func.
 * @param {Function} fn - The function to have its output memoized
 * @returns {Function} Returns the new memoized function
 */
function memoize(fn) {
  const cache = new Map();
  return function (arg) {
    const key = JSON.stringify(arg);
    if (cache.has(key)) return cache.get(key);
    const result = fn(arg);
    cache.set(key, result);
    return result;
  };
}

// ANSI color helpers (chalk replacement for CommonJS)
const colors = {
  red: (str) => `\x1b[31m${str}\x1b[0m`,
  green: (str) => `\x1b[32m${str}\x1b[0m`,
  yellow: (str) => `\x1b[33m${str}\x1b[0m`,
  blue: (str) => `\x1b[34m${str}\x1b[0m`,
  magenta: (str) => `\x1b[35m${str}\x1b[0m`,
  bold: (str) => `\x1b[1m${str}\x1b[0m`,
};

module.exports = {
  get,
  memoize,
  colors,
};
