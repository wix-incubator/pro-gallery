import content from './content';
import dataTypes from './dataTypes';
import isRelevant from './isRelevant';
import {SECTIONS, stylesList, sectionByStyle} from './sections';
import { gallerySettings } from 'pro-gallery';

const settingsManager = stylesList.reduce((obj, styleParam) => {
  const settingsData = gallerySettings[styleParam] || {
    isRelevant: isRelevant[styleParam],
    ...content[styleParam],
    ...dataTypes[styleParam],
    isOld: true
  };

  return {
    ...obj,
    [styleParam]: {
      ...settingsData,
      section: sectionByStyle[styleParam]
    }
  }
}, {});

export {
  SECTIONS,
  settingsManager
}
