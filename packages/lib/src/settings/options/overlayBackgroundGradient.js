import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Overlay Background Gradient',
  description: `Apply gradient to the overlay background`,
  isRelevantDescription: 'Set "Texts Placement" to "Show On Hover".',
  isRelevant: (sp) => GALLERY_CONSTS.hasHoverPlacement(sp.titlePlacement),
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.overlayBackgroundGradient.NONE,
  options: createOptions('overlayBackgroundGradient'),
};
