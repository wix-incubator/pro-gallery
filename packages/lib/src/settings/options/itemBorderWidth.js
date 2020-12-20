import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Item Border Width',
  description: `Set the border width for each item in the gallery .`,
  isRelevantDescription: '"Crop Type" must not be set to "Fit".',
  isRelevant: (styleParams) =>
    styleParams.cubeType !== GALLERY_CONSTS.cubeType.FIT,
  type: INPUT_TYPES.NUMBER,
  default: 0,
};
