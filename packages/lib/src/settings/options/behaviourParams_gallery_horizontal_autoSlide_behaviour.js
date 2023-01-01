import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Auto slide Behaviour',
  isRelevant: (sp) =>
    sp.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Auto Slide" to "true".',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.autoSlideBehaviour.OFF,
  options: createOptions('autoSlideBehaviour'),
  description: `Choose the type of auto-scrolling to be used when navigation between items, "OFF" (auto-scrolling disabled) "INTERVAL" (time between navigation) or "CONTINOUS" (Continuous scrolling).`,
};
