import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Thumbnails Spacings',
  isRelevant: (options) =>
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
    options.hasThumbnails,
  isRelevantDescription: 'Set "Gallery preset" to "Thumbnail".',
  type: INPUT_TYPES.NUMBER,
  default: 4,
  description: `Set the spacing between thumbnails.
  `,
};
