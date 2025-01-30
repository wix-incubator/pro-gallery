import { INPUT_TYPES } from '../utils/constants.js';
import { createOptions } from '../utils/utils.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Click Action',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].NOTHING,
  get options() {
    return createOptions(optionsMap.behaviourParams.item.clickAction);
  },
  description: `Specifies what happens when an item is clicked. To enable the 'expand' or 'fullscreen' options, make sure you're using the ExpandableProGallery component`,
};
