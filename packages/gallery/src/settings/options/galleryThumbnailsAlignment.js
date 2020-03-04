import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Thumbnails Position',
  isRelevant: (styleParams) => styleParams.oneRow && styleParams.hasThumbnails,
  type: INPUT_TYPES.TEXT,
  default: GALLERY_CONSTS.thumbnailsAlignment.BOTTOM,
  description: `Set the position of the sliding thumbnails relative to the gallery (bottom, top, left and right).
  `,
}