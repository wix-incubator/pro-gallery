import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Thumbnails Position',
  isRelevant: (options) =>
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL && //NEW STYPEPARAMS METHOD change to the new sp const
    options.hasThumbnails,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and enable Thumbnails.',
  type: INPUT_TYPES.TEXT,
  default: GALLERY_CONSTS.thumbnailsPosition.OUTSIDE_GALLERY,
  description: `Set the position of the navigation panel. On Gallery will make the panel float on the gallery itself while Outside Gallery will have the panel adjecant to it`,
};
