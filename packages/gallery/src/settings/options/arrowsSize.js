import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Navigation Arrows Size',
  isRelevant: (styleParams)  => styleParams.oneRow && styleParams.showArrows,
  type: INPUT_TYPES.NUMBER,
  min: 8,
  max: 80,
  default: 23,
  description: `Set the size of the navigation arrows in pixels.
  `,
}