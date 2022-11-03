import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Time Between Images',
  description: `Set an interval time when using autoSlide. `,
  min: 2,
  max: 30,
  isRelevant: (options) =>
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL && //NEW STYPEPARAMS METHOD use new sps
    options.behaviourParams.gallery.horizontal.autoSlide.behaviour ===
      GALLERY_CONSTS[
        optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour
      ].INTERVAL,
  type: INPUT_TYPES.NUMBER,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Auto slide Behaviour" to "INTERVAL".',
  default: 4, //NEW STYPEPARAMS METHOD one source
};
