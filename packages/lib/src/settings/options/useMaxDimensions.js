import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Use max dimensions if needed',
  description: `The gallery will strech small images to fit the item's container, when set to true
  the gallery will use the original image dimensions if it is too small for the container`,
  isRelevant: (styleParams) =>
    styleParams.cubeImages &&
    styleParams.cubeType === GALLERY_CONSTS.cubeType.FIT,
  isRelevantDescription: 'Set "Crop Images" to "true" and "Crop Type" to "fit"',
  type: INPUT_TYPES.BOOLEAN,
  default: true,
};
