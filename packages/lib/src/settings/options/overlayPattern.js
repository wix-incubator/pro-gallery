import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Overlay Backround Pattern',
  description: `The position of the overlay`,
  isRelevantDescription: 'Set "Texts Placement" to "Show On Hover".',
  isRelevant: (sp) => GALLERY_CONSTS.hasHoverPlacement(sp.titlePlacement),
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.overlayPatterns.COLOR,
  options: createOptions('overlayPatterns'),
};
