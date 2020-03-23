import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Crop Only Fill? (find a better name)',
  description: `When using cubeType (FIT), this option let you keep the image original ratio while not creating
  margins between the image and the image container.`,
  isRelevant: (styleParams) => styleParams.cubeImages && styleParams.cubeType === GALLERY_CONSTS.cubeType.FIT,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
}