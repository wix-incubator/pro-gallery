import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Overlay Background Color',
  description: `The color and opacity of the overlay background of the item`,
  isRelevant: (sp) => GALLERY_CONSTS.hasHoverPlacement(sp.titlePlacement),
  type: INPUT_TYPES.COLOR_PICKER,
  default: 'rgba(8, 8 ,8, 0.75)',
};
