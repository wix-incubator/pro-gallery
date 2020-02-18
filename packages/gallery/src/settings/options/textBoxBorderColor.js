import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Text Box Border Color',
  description: `Set the border color of the texts container for each item.`,
  isRelevant: (styleParams) => styleParams.titlePlacement !==
    GALLERY_CONSTS.placements.SHOW_ON_HOVER &&
    (styleParams.allowTitle || styleParams.allowDescription) &&
    styleParams.imageInfoType === GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
  type: INPUT_TYPES.COLOR_PICKER,
  // default: 0,
}