import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Max Group Size',
  isRelevant: (styleParams)  => styleParams.collageDensity > 0 && styleParams.groupsPerStrip > 1,
  type: INPUT_TYPES.NUMBER,
  min: 0,
  max: 3,
  default: 3,
  description: `Choose the max number of items grouping in the gallery, "1" for only one items per group and "3"(max) for up to 3 item per group.
  `,
}