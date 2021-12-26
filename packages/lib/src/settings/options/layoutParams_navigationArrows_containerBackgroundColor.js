import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Navigation arrows container background color',
  isRelevant: (options) => {
    return (
      options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
      options.showArrows &&
      options.layoutParams.navigationArrows.containerStyleType ===
        GALLERY_CONSTS.arrowsContainerStyleType.BOX
    );
  },
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal"), "Show Navigation Arrows" to "true" and Navigation arrows styling ("containerStyleType") to "BOX".',
  type: INPUT_TYPES.TEXT,
  default: 'rgba(0,0,0,0)',
  description: `Choose the color of the navigating arrows background.
  `,
};
