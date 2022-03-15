import { default as GALLERY_CONSTS } from '../../common/constants';
import { INPUT_TYPES } from '../utils/constants';

// Hi, I'm adding this comment because it's a bit aki to what I did here. this option expect an array that contains a number.
// And it's broken in the playground when I'm not moving it like I wrote above.
// We need to improve it and decide what the type will be, and how to move the default as an array that contain a number.
export default {
  title: 'Crop Ratios',
  description: `Crop each image according to the corresponding crop ratio as indicated in this string. This will create a pattern of cropped images`,
  isRelevantDescription: 'Set "Crop Images" to "true".',
  isRelevant: (options) =>
    options.cubeImages && options.cubeType === GALLERY_CONSTS.cubeType.CROP,
  type: INPUT_TYPES.NUMBER,
  default: [1],
};
