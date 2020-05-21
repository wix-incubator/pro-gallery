import { INPUT_TYPES, GALLERY_CONSTS } from '../utils/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Playing Options',
  description: `Choose when video items will start playing: On hover, on click or autoplay`,
  isRelevant: () => true,
  options: createOptions('videoPlay'),
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.videoPlay.HOVER,
}