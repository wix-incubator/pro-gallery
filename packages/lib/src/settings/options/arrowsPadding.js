import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Navigation Arrows Padding',
  isRelevant: (options) =>
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
    options.showArrows &&
    options.arrowsPosition === GALLERY_CONSTS.arrowsPosition.ON_GALLERY,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal"), set "Show Navigation Arrows" to "true" ans set "Navigation Arrows Position" to "On Gallery"',
  type: INPUT_TYPES.NUMBER,
  min: 0,
  max: 100,
  default: 23,
  description: `Set the left / right padding of the navigation arrows in pixels.`,
};
