import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Gallery Preset',
  description: `Choose from several preset of galleries`,
  isRelevantDescription: 'Always relevant.',
  isRelevant: () => true,
  type: INPUT_TYPES.OPTIONS,
  options: createOptions(optionsMap.layoutParams.structure.galleryLayout),
  default: GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
};
