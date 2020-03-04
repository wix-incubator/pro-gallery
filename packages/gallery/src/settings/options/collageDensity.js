import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Collage Density',
  description: `Determines how dense the collaging and grouping of images will be. Note that in order for this option to take any effect,
  the option "groupSize" needs to be set to more than 1`,
  isRelevant: (styleParams) => styleParams.groupSize > 1,
  type: INPUT_TYPES.NUMBER,
  default: 0.8,
}