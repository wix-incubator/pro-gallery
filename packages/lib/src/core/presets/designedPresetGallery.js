// import { calcTargetItemSize } from './layoutHelper';
import { mergeNestedObjects, flatToNested } from '../helpers/stylesUtils';
export const createStyles = (styles) => {
  try {
    const parsedStyleParams = styles.jsonStyleParams
      ? JSON.parse(styles.jsonStyleParams)
      : {};

    const styleParams = mergeNestedObjects(
      styles,
      flatToNested(parsedStyleParams)
    );

    return styleParams;
  } catch (e) {
    return {};
  }
};
