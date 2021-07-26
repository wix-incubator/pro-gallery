import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Overlay Position',
  description: `The color and opacity of the overlay background of the item`,
  isRelevantDescription: 'Set "Texts Placement" to "Show On Hover".',
  isRelevant: (sp) => GALLERY_CONSTS.hasHoverPlacement(sp.titlePlacement),
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.overlayPositions.LEFT,
  options: createOptions('overlayPositions'),
};
