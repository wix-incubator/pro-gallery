import { INPUT_TYPES } from '../utils/constants';
// import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Designed Preset',
  description: `Choose from several designed preset of galleries`,
  isRelevantDescription: `Set Gallery Layout to 'Empty'`,
  // isRelevant: (styleParams) =>
  //   styleParams.galleryLayout === GALLERY_CONSTS.layout.DESIGNED_PRESET,
  isRelevant: () => true,
  type: INPUT_TYPES.OPTIONS,
  options: createOptions('designedPreset'),
  // default: GALLERY_CONSTS.designedPreset.DESIGNED_PRESET_1,
  default: -1,
};
