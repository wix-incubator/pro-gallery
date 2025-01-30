import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import { default as autoSlideBehaviour } from './behaviourParams_gallery_horizontal_autoSlide_behaviour.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Pause Auto Slide On Hover',
  isRelevant: (options) =>
    autoSlideBehaviour.isRelevant(options) &&
    options[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour] !==
      GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour].OFF,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Auto Slide behaviour".',
  type: INPUT_TYPES.BOOLEAN,
  default: true, //one source
  description: `Pause "Auto Slide" when hovering over the gallery`,
};
