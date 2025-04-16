import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { default as autoSlideBehaviour } from './behaviourParams_gallery_horizontal_autoSlide_behaviour';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Auto Slide Play/Pause Button',
  isRelevant: (options) =>
    autoSlideBehaviour.isRelevant(options) &&
    options[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour] !==
      GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour].OFF,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Auto Slide" behaviour.',
  type: INPUT_TYPES.BOOLEAN,
  default: false, //one source
  description: `Show a play/pause button to toggle the slides transitions in auto slide`,
};
