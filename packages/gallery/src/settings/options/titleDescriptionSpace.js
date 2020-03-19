import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Title Description Spacing',
  isRelevant: (styleParams)  => styleParams.allowTitle && styleParams.allowDescription ,
  type: INPUT_TYPES.NUMBER,
  default: 0,
  min: 0,
  max: 50,
  description: `Set the spacing between the title and the description.
  `,
}