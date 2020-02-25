import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Text box border width',
  description: `Set the border width of the texts container for each item.`,
  isRelevant: (styleParams) => styleParams.titlePlacement !==
    GALLERY_CONSTS.placements.SHOW_ON_HOVER &&
    (styleParams.allowTitle || styleParams.allowDescription) &&
    styleParams.imageInfoType === GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
  type: INPUT_TYPES.NUMBER,
  default: 0,
}