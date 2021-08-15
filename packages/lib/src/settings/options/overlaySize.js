import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Overlay Size',
  description: `Size`,
  isRelevantDescription: 'Set "Texts Placement" to "Show On Hover".',
  isRelevant: (sp) => GALLERY_CONSTS.hasHoverPlacement(sp.titlePlacement),
  type: INPUT_TYPES.NUMBER,
  min: 0,
  default: 100,
};
