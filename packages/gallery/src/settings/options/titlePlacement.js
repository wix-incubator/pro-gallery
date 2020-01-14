import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Texts Placement',
  isRelevant: (styleParams) => styleParams.isVertical &&
    styleParams.groupSize === 1 && 
    styleParams.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.placements.SHOW_ON_HOVER,
  options: createOptions('placements'),
  description: `Choose the the placement of the texts (title and description) relative to the items in the gallery. Note that
  this option also deals with the hover effects and may overide "hoveringBehaviour" when set to anything but "SHOW_ON_HOVER".
  `,
}