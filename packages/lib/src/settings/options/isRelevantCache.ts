// import { INPUT_TYPES } from '../utils/constants';
import { default as galleryOptions } from './';
import { Options } from '../../common/interfaces/options';

const cache = {};

export function cachedIsRelevant(
  optionKey: string,
  options: Options,
  enumValue?: any
): boolean {
  return getOrSetInCache(
    cache[options.id] || (cache[options.id] = new Map()),
    optionKey + (enumValue ? enumValue : ''), //create a key with the specified option if there is one
    galleryOptions[optionKey].isRelevant,
    options,
    enumValue
  );
}

function getOrSetInCache(
  map,
  fld,
  func,
  options: Options,
  enumValue: any
): boolean {
  const val = map.get(fld);
  if (val !== undefined) {
    return val;
  }
  const newVal = func(options, enumValue);
  map.set(fld, newVal);
  return newVal;
}
