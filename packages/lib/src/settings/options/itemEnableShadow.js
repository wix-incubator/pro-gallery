import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Enable Item Shadow',
  isRelevantDescription:
    'First set "Crop Images" to "false" or set "Crop Type" to anything but "Fit".\nThen set "Choose info layout" to "Attached Background" or set "Texts Placement" to "Show On Hover".',
  isRelevant: (options) =>
    !(options.cubeImages && options.cubeType === GALLERY_CONSTS.cubeType.FIT) &&
    (options.imageInfoType === GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND ||
      options.titlePlacement === GALLERY_CONSTS.placements.SHOW_ON_HOVER),
  type: INPUT_TYPES.BOOLEAN,
  default: false,
};
