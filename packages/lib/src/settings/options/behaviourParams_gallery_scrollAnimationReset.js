import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Scroll Animation Reset',
  description: `Clear all scroll animations after 5 seconds of not scrolling`,
  isRelevantDescription:
    'To enable "Scroll Animation" either set a Vertical gallery ("Scroll Direction" as "Vertical")\nor set a Horizontal gallery ("Scroll Direction" as "Horizontal") with "Slide Animation" set to "Scroll".',
  isRelevant: (sp) =>
    sp.layoutParams_structure_scrollDirection === GALLERY_CONSTS.layoutParams_structure_scrollDirection.VERTICAL ||
    (sp.layoutParams_structure_scrollDirection === GALLERY_CONSTS.layoutParams_structure_scrollDirection.HORIZONTAL &&
      sp.behaviourParams_gallery_horizontal_slideAnimation ===
        GALLERY_CONSTS.behaviourParams_gallery_horizontal_slideAnimation.SCROLL),
  type: INPUT_TYPES.BOOLEAN,
  default: false,
};
