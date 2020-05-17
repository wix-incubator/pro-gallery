import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Thumbnail Size',
  isRelevant: (styleParams)  => styleParams.hasThumbnails,
  type: INPUT_TYPES.NUMBER,
  default: 120,
  min: 80,
  max: 300,
  description: `Set the size (width and height) of each of the thumbnails in the Thumbnail layout.
  `,
}
