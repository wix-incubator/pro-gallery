// import { calcTargetItemSize } from './layoutHelper';

export const createOptions = (options) => {
  try {
    const parsedOptions = options.jsonStyleParams
      ? JSON.parse(options.jsonStyleParams)
      : {};

    return {
      ...options,
      ...parsedOptions,
      // targetItemSize: calcTargetItemSize(styles),
    };
  } catch (e) {
    return {};
  }
};
