import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Text horizontal padding',
  isRelevant: (styleParams)  => styleParams.allowTitle || styleParams.allowDescription,
  type: INPUT_TYPES.NUMBER,
  default: 0,
  description: `Set the horizontal padding for the texts for each item in the gallery.
  `,
}