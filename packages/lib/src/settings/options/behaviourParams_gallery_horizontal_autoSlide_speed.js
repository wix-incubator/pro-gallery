import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Slide speed',
  description: `Set the slide speed when using "continuous" auto-scrolling.`,
  min: 100,
  max: 1000,
  isRelevant: (options) =>
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL && //NEW STYPEPARAMS METHOD use new sps and the behaviour is relevant
    options.behaviourParams.gallery.horizontal.autoSlide.behaviour ===
      GALLERY_CONSTS[
        optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour
      ].CONTINUOUS,
  type: INPUT_TYPES.NUMBER,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Auto slide Behaviour" to "CONTINUOUS".',
  default: 200,
};
