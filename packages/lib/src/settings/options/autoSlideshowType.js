import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

// refactor
export default {
  title: 'Auto slide Behaviour',
  isRelevant: (sp) =>
    sp.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
    sp.slideshowLoop &&
    sp.isAutoSlideshow,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Vertical")',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.autoSlideshowType.INTERVAL,
  options: createOptions('autoSlideshowType'),
  description: ``,
};
