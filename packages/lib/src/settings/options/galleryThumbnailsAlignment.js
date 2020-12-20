import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Thumbnails Position',
  isRelevant: (styleParams) => styleParams.oneRow && styleParams.hasThumbnails,
  isRelevantDescription:
    'set a Horizontal scrolled gallery, set "Slider Thumbnails" to "true".',
  type: INPUT_TYPES.TEXT,
  default: GALLERY_CONSTS.thumbnailsAlignment.BOTTOM,
  description: `Set the position of the sliding thumbnails relative to the gallery (bottom, top, left and right).`,
};
