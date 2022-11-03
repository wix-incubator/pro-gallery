import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Thumbnails Position',
  isRelevant: (options) => {
    if (options.newSPs) {
      return (
        options[optionsMap.layoutParams.structure.scrollDirection] ===
          GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
            .HORIZONTAL && //NEW STYPEPARAMS METHOD change to the new sp const
        options[optionsMap.layoutParams.thumbnails.enable]
      );
    } else {
      return (
        options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL && //NEW STYPEPARAMS METHOD change to the new sp const
        options.hasThumbnails
      );
    }
  },
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and enable Thumbnails.',
  type: INPUT_TYPES.TEXT,
  default:
    GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.position].OUTSIDE_GALLERY,
  description: `Set the position of the navigation panel. On Gallery will make the panel float on the gallery itself while Outside Gallery will have the panel adjecant to it`,
};
