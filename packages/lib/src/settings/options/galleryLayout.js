import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Gallery Preset',
  description: `Choose from several preset of galleries`,
  isRelevant: () => true,
  type: INPUT_TYPES.OPTIONS,
  options: createOptions('layout'),
  default: GALLERY_CONSTS.layout.EMPTY,
}
