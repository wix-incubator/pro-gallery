import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Enable Item Shadow',
  isRelevantDescription:
    'Set "Crop Images" to "false" or set "Crop Type" to anything but "Fit" and set "Choose info layout" to "Attached Background" or set "Texts Placement" to "Show On Hover"',
  isRelevant: (styleParams) =>
    !(
      styleParams.cubeImages &&
      styleParams.cubeType === GALLERY_CONSTS.cubeType.FIT
    ) &&
    (styleParams.imageInfoType ===
      GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND ||
      styleParams.titlePlacement === GALLERY_CONSTS.placements.SHOW_ON_HOVER),
  type: INPUT_TYPES.BOOLEAN,
  default: false,
};
