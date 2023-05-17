import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Slide Transition',
  description: `Choose the kind of transition you want to have when moving to the next item by clicking the arrows in horizontal layouts`,
  isRelevantDescription: 'To enable this set "Scroll Direction" to "Horizontal" and "Slide Animation" to "Scroll".',
  isRelevant: (options) =>
    options[optionsMap.layoutParams.structure.scrollDirection] ===
      GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL &&
    options[optionsMap.behaviourParams.gallery.horizontal.slideAnimation] ===
      GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideAnimation].SCROLL,
  type: INPUT_TYPES.TEXT,
  default: GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideTransition].EASE, //one source
};
