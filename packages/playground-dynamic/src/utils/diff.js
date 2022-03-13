/**
 * Deep diff between two objects or arrays.
 * @param  {Object} fromObject the original object
 * @param  {Object} toObject   the updated object
 * @return {Object}            a new object which represents the diff
 *
 * @example
 * const obj1 = { a: 1, b: 2, c: 3, r: [1, 2, 3] };
 * const obj2 = { a: 1, b: 2, c: 4, r: [1, 2, 3, 4] };
 * const diff = diffObject(obj1, obj2);
 * console.log(diff);
 * // { c: 4, r: { 3: 4 } }
 */

export function deepDiff(fromObject, toObject) {
  const fromObjectKeys = Object.keys(fromObject);
  const toObjectKeys = Object.keys(toObject);
  const diff = {};

  for (let i = 0; i < fromObjectKeys.length; i += 1) {
    const key = fromObjectKeys[i];

    if (toObject[key] === undefined || toObject[key] !== fromObject[key]) {
      diff[key] = toObject[key];
    }
  }

  for (let i = 0; i < toObjectKeys.length; i += 1) {
    const key = toObjectKeys[i];

    if (fromObject[key] === undefined) {
      diff[key] = toObject[key];
    }
  }

  return diff;
}
