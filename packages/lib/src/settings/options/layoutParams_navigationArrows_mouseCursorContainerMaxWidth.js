import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Mouse Cursor Container Max Width',
  isRelevant: (options) =>
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
    options.showArrows &&
    options.arrowsPosition === GALLERY_CONSTS.arrowsPosition.MOUSE_CURSOR,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal"), set "Show Navigation Arrows" to "true" and set "Navigation Arrows Position" to "Mouse Cursor".',
  type: INPUT_TYPES.NUMBER,
  min: 0,
  max: 100,
  default: 100,
  description: `Set the size of the container mouse cursor in percentage.`,
};
