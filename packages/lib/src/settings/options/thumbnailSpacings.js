import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Thumbnails Spacings',
  isRelevant: (styleParams) => styleParams.oneRow && styleParams.hasThumbnails,
  isRelevantDescription:
    'set Horizontal scrolled gallery, set "Slider Thumbnails" to "true".',
  type: INPUT_TYPES.NUMBER,
  default: 4,
  description: `Set the spacing between thumbnails.
  `,
};
