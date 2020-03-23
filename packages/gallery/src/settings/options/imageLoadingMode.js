import { INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';
import GALLERY_CONSTS from '../../common/constants';

export default {
  title: 'Loading Placeholder',
  description: `Determines what is shown until the image is loaded.`,
  isRelevant: () => true,
  options: createOptions('loadingMode'),
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.loadingMode.BLUR,
}