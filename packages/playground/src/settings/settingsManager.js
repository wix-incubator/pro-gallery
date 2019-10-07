import content from './content';
import dataTypes from './dataTypes';
import isRelevant from './isRelevant';

const settingsManager = Object.keys(content).reduce((obj, styleParam) => ({
  ...obj,
  [styleParam]: {
    isRelevant: isRelevant[styleParam],
    ...content[styleParam],
    ...dataTypes[styleParam],
  }
}), {});

export {
  settingsManager
}