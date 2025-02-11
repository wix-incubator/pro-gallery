// import { calcTargetItemSize } from './layoutHelper.js';
import { mergeNestedObjects, flatToNested } from '../helpers/optionsUtils.js';

export const createOptions = (options) => {
  try {
    const parsedOptions = options.jsonStyleParams ? JSON.parse(options.jsonStyleParams) : {};

    const combinedOptions = mergeNestedObjects(options, flatToNested(parsedOptions));

    return combinedOptions;
  } catch (e) {
    return {};
  }
};
