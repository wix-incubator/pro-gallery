import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';

const {SHOW_ABOVE,SHOW_BELOW} = GALLERY_CONSTS.placements;

export default {
  title: 'Text Space From Image',
  isRelevant: (styleParams)  => (styleParams.allowTitle || styleParams.allowDescription) &&
  styleParams.imageInfoType === GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND &&
  [SHOW_ABOVE,SHOW_BELOW].indexOf(styleParams.titlePlacement) > -1 ,
  type: INPUT_TYPES.NUMBER,
  default: 10,
  description: `Set the space between the item and the texts in the gallery. Note that this option is relevant
  to galleries with texts separated from the image (texts below image or above image).
  `,
}