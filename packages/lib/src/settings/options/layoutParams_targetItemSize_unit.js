import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import { createOptions } from '../utils/utils.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Item Size Units',
  description: `Choose which units to use when setting the target size of each item: by layout, relative to width or in pixels (recommended)`,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.layoutParams.targetItemSize.unit].SMART,
  get options() {
    return createOptions(optionsMap.layoutParams.targetItemSize.unit);
  },
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
};
