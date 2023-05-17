// import { calcTargetItemSize } from './layoutHelper';
import { mergeNestedObjects, flatToNested } from '../helpers/optionsUtils';

export const createOptions = (options) => {
  try {
    const parsedOptions = options.jsonStyleParams ? JSON.parse(options.jsonStyleParams) : {};

    const combinedOptions = mergeNestedObjects(options, flatToNested(parsedOptions));

    return combinedOptions;
  } catch (e) {
    return {};
  }
};
