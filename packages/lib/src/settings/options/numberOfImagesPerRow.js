import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Images Per Row',
  isRelevantDescription:
    'Set a Vertical gallery ("Scroll Direction" as "Vertical"), set "Layout Orientation" to "Column" and set "Max Group Size" to be "1".',
  isRelevant: (styleParams) =>
    styleParams.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL &&
    styleParams.isVertical &&
    styleParams.gridStyle === 1,
  type: INPUT_TYPES.NUMBER,
  default: 3,
  description: `This sets the number of items per row in the gallery. Note that this option relies on a number of options, the gallery must be
    a vertical scrolled gallery (scrollDirection = 1), layout orientation (isVertical) must be set to "true" and gridStyle must be set to "1" for this option to have an effect. Currently the only supporting
    layouts are Grid and Masonry
  `,
};
