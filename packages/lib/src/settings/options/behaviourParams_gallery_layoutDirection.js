import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Layout Direction',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection].LEFT_TO_RIGHT, //one source
  get options() {
    return createOptions(optionsMap.behaviourParams.gallery.layoutDirection);
  },
  description: `Set the direction of the gallery layout (right to left or left to right)`,
};
