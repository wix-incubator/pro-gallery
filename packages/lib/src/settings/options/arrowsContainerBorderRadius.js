import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Navigation arrows container border radius',
  isRelevant: (options) =>
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
    options.showArrows &&
    options.arrowsContainerStyleType ===
      GALLERY_CONSTS.arrowsContainerStyleType.BOX,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal"), "Show Navigation Arrows" to "true" and Navigation arrows styling ("arrowsContainerStyleType") to "BOX".',
  type: INPUT_TYPES.NUMBER,
  default: 0,
  description: `Choose the border radius of the navigating arrows container.
  `,
};
