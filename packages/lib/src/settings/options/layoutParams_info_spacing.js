//NEW STYPEPARAMS METHOD
import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

const { SHOW_ABOVE, SHOW_BELOW } = GALLERY_CONSTS.placements;

export default {
  title: 'Text Space From Image',
  isRelevantDescription:
    'Set "Choose info layout" to "Separated Background" and set "Texts Placement" to contain "Show Above" or "Show Below".',
  isRelevant: (options) =>
    options.imageInfoType === GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND &&
    [SHOW_ABOVE, SHOW_BELOW].indexOf(options.titlePlacement) > -1,
  type: INPUT_TYPES.NUMBER,
  default: 10,
  description: `Set the space between the item and the texts in the gallery. Note that this option is relevant
  to galleries with texts separated from the image (texts below image or above image).
  `,
};
