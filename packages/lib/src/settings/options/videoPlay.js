import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Play Video On',
  description: `Choose when video items will start playing: On hover, on click or autoplay`,
  isRelevant: () => true,
  options: createOptions('videoPlay'),
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.videoPlay.HOVER,
};
