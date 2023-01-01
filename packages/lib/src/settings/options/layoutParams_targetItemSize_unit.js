//NEW STYPEPARAMS METHOD
import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Item Size Units',
  description: `Choose which units to use when setting the target size of each item: by layout, relative to width or in pixels (recommended)`,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.layoutParams.targetItemSize.unit].SMART,
  options: createOptions('gallerySizeType'),
  isRelevant: () => true, //NEW STYPEPARAMS METHOD why is this different from the value isRelevant??????
  isRelevantDescription: 'Always relevant.',
};
