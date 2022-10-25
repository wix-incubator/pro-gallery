//NEW STYPEPARAMS METHOD
import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Slide Animation',
  isRelevant: (options) =>
    options[optionsMap.layoutParams.structure.scrollDirection] ===
      GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
        .HORIZONTAL &&
    options[optionsMap.layoutParams.groups.groupSize] === 1 &&
    options[optionsMap.layoutParams.crop.enable] &&
    options[optionsMap.layoutParams.crop.ratios] === ['100%/100%'], //NEW STYPEPARAMS METHOD check that this works
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal"), set "Max Group Size" to "1" and set "Crop Images" to true.',
  type: INPUT_TYPES.OPTIONS,
  default:
    GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideAnimation]
      .SCROLL, //NEW STYPEPARAMS METHOD one source
  options: createOptions(
    optionsMap.behaviourParams.gallery.horizontal.slideAnimation
  ),
  description: `Choose the slide animation effect to be used when navigating between items in a slideshow`,
};
