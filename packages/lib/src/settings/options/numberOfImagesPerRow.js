import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Images Per Row',
  isRelevantDescription:
    'set a Vertical scrolled gallery, set "Layout Orientation" to "Column", set "Max Group Size" to be "1".',
  isRelevant: (styleParams) =>
    !styleParams.oneRow &&
    styleParams.isVertical &&
    styleParams.gridStyle === 1,
  type: INPUT_TYPES.NUMBER,
  default: 3,
  description: `This sets the number of items per row in the gallery. Note that this option relies on a number of options, the gallery must be
    a vertical scrolled gallery (scrollDirection = 1), layout orientation (isVertical) must be set to "true" and gridStyle must be set to "1" for this option to have an effect. Currently the only supporting
    layouts are Grid and Masonry
  `,
};
