import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import { default as autoSlideBehaviour } from './behaviourParams_gallery_horizontal_autoSlide_behaviour.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Show Slideshow Counter',
  isRelevant: (options) =>
    autoSlideBehaviour.isRelevant(options) &&
    options[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour] !==
      GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour].OFF,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Auto Slide" to "true".',
  type: INPUT_TYPES.BOOLEAN,
  default: false, //one source
  description: `Display an index of the current slide`,
};
