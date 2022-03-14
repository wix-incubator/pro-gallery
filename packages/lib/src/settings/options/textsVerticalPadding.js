import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Text vertical padding',
  isRelevantDescription:
    'Set "Texts Placement" to anything but "Show On Hover".',
  isRelevant: (options) =>
    options.titlePlacement !== GALLERY_CONSTS.placements.SHOW_ON_HOVER,
  type: INPUT_TYPES.NUMBER,
  default: 0,
  description: `Set the vertical padding for the texts for each item in the gallery.
  `,
};
