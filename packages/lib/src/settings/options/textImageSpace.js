import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

const { SHOW_ABOVE, SHOW_BELOW } = GALLERY_CONSTS.placements;

export default {
  title: 'Text Space From Image',
  isRelevantDescription:
    'set "Choose info layout" to "Separated Background", set "Texts Placement" to "Show Above" or "Show Below".',
  isRelevant: (styleParams) =>
    styleParams.imageInfoType ===
      GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND &&
    [SHOW_ABOVE, SHOW_BELOW].indexOf(styleParams.titlePlacement) > -1,
  type: INPUT_TYPES.NUMBER,
  default: 10,
  description: `Set the space between the item and the texts in the gallery. Note that this option is relevant
  to galleries with texts separated from the image (texts below image or above image).
  `,
};
