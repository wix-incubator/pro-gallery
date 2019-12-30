import content from './old/content';
import dataTypes from './old/dataTypes';
import isRelevant from './old/isRelevant';
import newGallerySettings from './index';
import defaultStyles from '../common/defaultStyles';

const mergedSettings = Object.keys(isRelevant).reduce((obj, styleParam) => {
    const settingsData = newGallerySettings[styleParam] || {
      isRelevant: isRelevant[styleParam],
      ...content[styleParam],
      ...dataTypes[styleParam],
      default: defaultStyles[styleParam],
      isOld: true
    };
  
    return {
      ...obj,
      [styleParam]: settingsData,
    }
  }, {});
  
  export default mergedSettings;