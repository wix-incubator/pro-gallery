import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Enable Item Shadow',
  isRelevant: (styleParams) =>
    !(styleParams.cubeImages && styleParams.cubeType === GALLERY_CONSTS.cubeType.FIT) &&
    (styleParams.imageInfoType === GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND ||
      styleParams.titlePlacement === GALLERY_CONSTS.placements.SHOW_ON_HOVER),
  type: INPUT_TYPES.BOOLEAN,
  default: false,
}