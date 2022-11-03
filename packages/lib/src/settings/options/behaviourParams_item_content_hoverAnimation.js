//NEW STYPEPARAMS METHOD
import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Image Hover Animation',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.OPTIONS,
  default:
    GALLERY_CONSTS[optionsMap.behaviourParams.item.content.hoverAnimation]
      .NO_EFFECT,
  options: createOptions(
    optionsMap.behaviourParams.item.content.hoverAnimation
  ),
  description: `Choose the image animation effect to be used when hovering on each item.
  `,
};
