import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'One Color Animation Color',
  description: `Set the color for the one color animation.`,
  isRelevantDescription: 'Set "Scroll Animation" to "One Color".',
  isRelevant: (styleParams) =>
    styleParams.scrollAnimation === GALLERY_CONSTS.scrollAnimations.ONE_COLOR,
  type: INPUT_TYPES.COLOR_PICKER,
  default: 'rgba(208, 208 ,208, 1)',
};
