import content from './content';
import dataTypes from './dataTypes';
import isRelevant from './isRelevant';
import {SECTIONS, stylesList, sectionByStyle} from './sections';

const settingsManager = stylesList.reduce((obj, styleParam) => ({
  ...obj,
  [styleParam]: {
    isRelevant: isRelevant[styleParam],
    ...content[styleParam],
    ...dataTypes[styleParam],
    section: sectionByStyle[styleParam]
  }
}), {});

export {
  SECTIONS,
  settingsManager
}