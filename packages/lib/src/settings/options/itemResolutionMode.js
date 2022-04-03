import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Item Resolution Mode',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.itemResolutionMode.SCALED_DOWN,
  options: createOptions('itemResolutionMode'),
  description: `Set the resolution loading mode for the images in the gallery,
  use "full" option to load the images in full resolution and the "sclaed down" option to load the images in thir container size.`,
};
