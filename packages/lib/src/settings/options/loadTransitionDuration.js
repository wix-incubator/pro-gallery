import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Image Load Transition Duration',
  description: `Set the length of the transition effect used when image are loading and changing resolution`,
  type: INPUT_TYPES.NUMBER,
  default: 300,
  isRelevant: (options) => {
    const loadTransition = options.behaviourParams_item_loadTransition;
    return loadTransition !== GALLERY_CONSTS.loadTransition.NO_EFFECT;
  },
  isRelevantDescription: 'Set Image Load Transition First',
};
