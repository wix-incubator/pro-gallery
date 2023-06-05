import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Text Box Border Color',
  description: `Set the border color of the texts container for each item.`,
  isRelevantDescription:
    'Set "Texts Placement" to anything but "Show On Hover" and set "Choose info layout" to "Separated Background".',
  isRelevant: (options) =>
    !GALLERY_CONSTS.hasHoverPlacement(options[optionsMap.layoutParams.info.placement]) &&
    options[optionsMap.layoutParams.info.layout] ===
      GALLERY_CONSTS[optionsMap.layoutParams.info.layout].SEPARATED_BACKGROUND,
  type: INPUT_TYPES.COLOR_PICKER,
};
