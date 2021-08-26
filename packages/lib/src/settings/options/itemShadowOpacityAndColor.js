import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Item Shadow Color',
  isRelevantDescription:
    'First set a Vertical gallery ("Scroll Direction" as "Vertical").\nThen set "Crop Images" to "false" or set "Crop Type" to anything but "Fit".\nThen set "Choose info layout" to "Attached Background" or set "Texts Placement" to "Show On Hover".\nThen set "Enable Item Shadow" to "true".',
  isRelevant: (options) =>
    options.itemEnableShadow &&
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL &&
    !(
      options.cubeImages &&
      options.cubeType === GALLERY_CONSTS.cubeType.FIT
    ) &&
    (options.imageInfoType ===
      GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND ||
      options.titlePlacement === GALLERY_CONSTS.placements.SHOW_ON_HOVER),
  type: INPUT_TYPES.COLOR_PICKER,
  default: 'rgba(0,0,0,0.3)',
};
