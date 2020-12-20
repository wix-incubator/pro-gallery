import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Text Box Border Color',
  description: `Set the border color of the texts container for each item.`,
  isRelevantDescription:
    '"Texts Placement" most not be set to "Show On Over", set "Choose info layout" to "Separated Background".',
  isRelevant: (styleParams) =>
    styleParams.titlePlacement !== GALLERY_CONSTS.placements.SHOW_ON_HOVER &&
    styleParams.imageInfoType === GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
  type: INPUT_TYPES.COLOR_PICKER,
  // default: 0,
};
