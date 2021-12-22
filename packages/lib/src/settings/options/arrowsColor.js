import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Navigation Arrows Color',
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Show Navigation Arrows" to "true".',
  isRelevant: (options) =>
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
    options.showArrows,
  type: INPUT_TYPES.COLOR_PICKER,
  default: 'rgba(0,0,0,0.3)',
};
