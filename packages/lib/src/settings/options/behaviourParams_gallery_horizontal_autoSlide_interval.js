import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import optionsMap from '../../core/helpers/optionsMap.js';
import { default as autoSlideBehaviour } from './behaviourParams_gallery_horizontal_autoSlide_behaviour.js';
export default {
  title: 'Time Between Images',
  description: `Set an interval time when using autoSlide. `,
  min: 2,
  max: 30,
  isRelevant: (options) => {
    return (
      autoSlideBehaviour.isRelevant(options) &&
      options[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour] ===
        GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour].INTERVAL
    );
  },
  type: INPUT_TYPES.NUMBER,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Auto slide Behaviour" to "INTERVAL".',
  default: 4, //one source
};
