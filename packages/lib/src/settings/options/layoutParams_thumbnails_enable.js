//NEW STYPEPARAMS METHOD
import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Enable Thumbnails Navigation Bar for Horizontal Layouts',
  isRelevant: (options) =>
    options[optionsMap.layoutParams.structure.scrollDirection] ===
    GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
      .HORIZONTAL,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal").',
  type: INPUT_TYPES.BOOLEAN,
  default: false,
  description: `Choose if you want to have slider thumbnails in the gallery. Note that this option is relevant only
  to galleries that render the slideShowView component.
  `,
};
