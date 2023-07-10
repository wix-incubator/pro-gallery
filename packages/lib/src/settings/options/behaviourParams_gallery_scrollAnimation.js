import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Scroll Animation',
  description: `Choose the type of animation to be used when items appear while scrolling vertically through the gallery`,
  isRelevantDescription:
    'To enable "Scroll Animation" either set a Vertical gallery ("Scroll Direction" as "Vertical")\nor set a Horizontal gallery ("Scroll Direction" as "Horizontal") with "Slide Animation" set to "Scroll".',
  isRelevant: (options) =>
    options[optionsMap.layoutParams.structure.scrollDirection] ===
      GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL ||
    (options[optionsMap.layoutParams.structure.scrollDirection] ===
      GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL &&
      options[optionsMap.behaviourParams.gallery.horizontal.slideAnimation] ===
        GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideAnimation].SCROLL),
  get options() {
    return createOptions(optionsMap.behaviourParams.gallery.scrollAnimation);
  },
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.behaviourParams.gallery.scrollAnimation].NO_EFFECT, //one source
};
