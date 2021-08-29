import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Crop Only Fill? (find a better name)',
  description: `When using cubeType (FIT), this option let you keep the image original ratio while not creating
  margins between the image and the image container.`,
  isRelevant: (options) =>
    options.cubeImages && options.cubeType === GALLERY_CONSTS.cubeType.FIT,
  isRelevantDescription:
    'Set "Crop Images" to "true" and set "Crop Type" to "Fit".',
  type: INPUT_TYPES.BOOLEAN,
  default: false,
};
