import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Text vertical padding',
  isRelevant: (styleParams)  => styleParams.titlePlacement !== GALLERY_CONSTS.placements.SHOW_ON_HOVER,
  type: INPUT_TYPES.NUMBER,
  default: 0,
  description: `Set the vertical padding for the texts for each item in the gallery.
  `,
}
