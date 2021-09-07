import { INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Magnification Type',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.magnificationType.ZOOM,
  options: createOptions('magnificationType'),
  description: `Specifies what the type of image magnification`,
};
