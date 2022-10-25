//NEW STYPEPARAMS METHOD
import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Loading Placeholder',
  description: `Determines what is shown until the image is loaded.`,
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  options: createOptions(optionsMap.behaviourParams.item.content.loader),
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.behaviourParams.item.content.loader].BLUR,
};
