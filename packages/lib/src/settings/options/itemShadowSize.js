import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Item Shadow Size',
  isRelevantDescription:
    'Set a Vertical scrolled gallery, set "Enable Item Shadow" to "true", set "Crop Images" to "true", set "Crop Type" to "Crop", set "Choose info layout" to "Attached Background" or set "Texts Placement" to "Show On Over".',
  isRelevant: (styleParams) =>
    styleParams.itemEnableShadow &&
    !styleParams.oneRow &&
    !(
      styleParams.cubeImages &&
      styleParams.cubeType === GALLERY_CONSTS.cubeType.FIT
    ) &&
    (styleParams.imageInfoType ===
      GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND ||
      styleParams.titlePlacement === GALLERY_CONSTS.placements.SHOW_ON_HOVER),
  type: INPUT_TYPES.NUMBER,
  default: 10,
};
