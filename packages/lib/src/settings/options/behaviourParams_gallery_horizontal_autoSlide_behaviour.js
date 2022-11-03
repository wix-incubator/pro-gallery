import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Auto slide Behaviour',
  isRelevant: (sp) =>
    sp.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL, //NEW STYPEPARAMS METHOD change this to new sps
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Auto Slide" to "true".',
  type: INPUT_TYPES.OPTIONS,
  default:
    GALLERY_CONSTS[
      optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour
    ].OFF,
  options: createOptions(
    optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour
  ),
  description: `Choose the type of auto-scrolling to be used when navigation between items, "OFF" (auto-scrolling disabled) "INTERVAL" (time between navigation) or "CONTINOUS" (Continuous scrolling).`,
};
