import { GALLERY_CONSTS } from '../..';
import optionsMap from '../../core/helpers/optionsMap';
import { INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';

export default {
  title: `3D play trigger`,
  description: 'What interaction is needed to load the 3D scene',
  isRelevant: () => true,
  type: INPUT_TYPES.OPTIONS,
  get options() {
    return createOptions(optionsMap.behaviourParams.item.threeDimensionalScene.playTrigger);
  },
  default: GALLERY_CONSTS[optionsMap.behaviourParams.item.threeDimensionalScene.playTrigger].HOVER,
};
