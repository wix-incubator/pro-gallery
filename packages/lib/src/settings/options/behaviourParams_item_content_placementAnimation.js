import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Image Placement Animation',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.behaviourParams.item.content.placementAnimation].NO_EFFECT,
  get options() {
    return createOptions(optionsMap.behaviourParams.item.content.placementAnimation);
  },
  description: `Choose an effect that happens to the image when placed/replaced on the gallery.`,
};
