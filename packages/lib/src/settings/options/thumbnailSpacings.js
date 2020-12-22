import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Thumbnails Spacings',
  isRelevant: (styleParams) => styleParams.oneRow && styleParams.hasThumbnails,
  isRelevantDescription: 'Set "Gallery preset" to "Thumbnail".',
  type: INPUT_TYPES.NUMBER,
  default: 4,
  description: `Set the spacing between thumbnails.
  `,
};
