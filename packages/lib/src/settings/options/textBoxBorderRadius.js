import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Text Box Border Radius',
  description: `Set the border radius of the texts container for each item.`,
  isRelevant: (styleParams) =>
    styleParams.titlePlacement !== GALLERY_CONSTS.placements.SHOW_ON_HOVER &&
    styleParams.imageInfoType === GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
  type: INPUT_TYPES.NUMBER,
  default: 0,
};
