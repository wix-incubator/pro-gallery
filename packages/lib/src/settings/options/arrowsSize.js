import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Navigation Arrows Size',
  isRelevant: (styleParams) =>
    styleParams.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
    styleParams.showArrows,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Show Navigation Arrows" to "true".',
  type: INPUT_TYPES.NUMBER,
  min: 8,
  max: 80,
  default: 23,
  description: `Set the size of the navigation arrows in pixels.
  `,
};
