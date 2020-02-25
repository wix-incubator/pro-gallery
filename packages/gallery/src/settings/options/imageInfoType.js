import { INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';
import GALLERY_CONSTS from '../../common/constants';

export default {
  title: 'Choose info layout',
  description: `Choose the layout you want for your texts, you can choose to separate the texts and the items
  so you can style them separately.`,
  isRelevant: (styleParams) => (styleParams.allowTitle || styleParams.allowDescription) &&
  styleParams.groupSize === 1 && styleParams.isVertical && 
  styleParams.titlePlacement !== GALLERY_CONSTS.placements.SHOW_ON_HOVER,
  options: createOptions('infoType'),
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.infoType.NO_BACKGROUND,
}