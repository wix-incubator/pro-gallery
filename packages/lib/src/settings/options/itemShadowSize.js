import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Item Shadow Size',
  isRelevantDescription:
    'First set a Vertical gallery ("Scroll Direction" as "Vertical").\nThen set "Crop Images" to "false" or set "Crop Type" to anything but "Fit".\nThen set "Choose info layout" to "Attached Background" or set "Texts Placement" to "Show On Hover".\nThen set "Enable Item Shadow" to "true".',
  isRelevant: (styleParams) =>
    styleParams.itemEnableShadow &&
    styleParams.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL &&
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
