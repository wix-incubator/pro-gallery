// import { calcTargetItemSize } from './layoutHelper';

export const createStyles = (styles) => {
  try {
    const parsedStyleParams = styles.jsonStyleParams
      ? JSON.parse(styles.jsonStyleParams)
      : {};

    const styleParams = {
      ...styles,
      ...parsedStyleParams,
      // targetItemSize: calcTargetItemSize(styles),
    };

    return styleParams;
  } catch (e) {
    return {};
  }
};
