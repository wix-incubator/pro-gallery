import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import optionsMap from '../../core/helpers/optionsMap.js';
import { default as autoSlideBehaviour } from './behaviourParams_gallery_horizontal_autoSlide_behaviour.js';

export default {
  title: 'Slide speed',
  description: `Set the slide speed when using "continuous" auto-scrolling.`,
  min: 100,
  max: 1000,
  isRelevant: (options) => {
    return (
      autoSlideBehaviour.isRelevant(options) &&
      options[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour] ===
        GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour].CONTINUOUS
    );
  },
  type: INPUT_TYPES.NUMBER,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Auto slide Behaviour" to "CONTINUOUS".',
  default: 200,
};
