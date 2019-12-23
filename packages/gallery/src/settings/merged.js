import content from './old/content';
import dataTypes from './old/dataTypes';
import isRelevant from './old/isRelevant';

import gallerySettings from './index';

const mergedSettings = Object.keys(isRelevant).reduce((obj, styleParam) => {
    const settingsData = gallerySettings[styleParam] || {
      isRelevant: isRelevant[styleParam],
      ...content[styleParam],
      ...dataTypes[styleParam],
      isOld: true
    };
  
    return {
      ...obj,
      [styleParam]: settingsData,
    }
  }, {});
  
  export default mergedSettings;