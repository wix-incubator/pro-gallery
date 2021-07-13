import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

// refactor
export default {
  title: 'Slide show speed',
  description: ``,
  min: 4,
  max: 8,
  isRelevant: (styleParams) =>
    styleParams.isAutoSlideshow &&
    styleParams.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
    styleParams.slideshowLoop,
  type: INPUT_TYPES.NUMBER,
  isRelevantDescription: 'sssss',
  default: 4,
};
