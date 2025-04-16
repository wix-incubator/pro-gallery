import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

const { ABOVE, BELOW } = GALLERY_CONSTS[optionsMap.layoutParams.info.placement];

export default {
  title: 'Text Space From Image',
  isRelevantDescription:
    'Set "Choose info layout" to "Separated Background" and set "Texts Placement" to contain "Show Above" or "Show Below".',
  isRelevant: (options) =>
    options[optionsMap.layoutParams.info.layout] ===
      GALLERY_CONSTS[optionsMap.layoutParams.info.layout].SEPARATED_BACKGROUND &&
    [ABOVE, BELOW].indexOf(options[optionsMap.layoutParams.info.placement]) > -1,
  type: INPUT_TYPES.NUMBER,
  default: 10,
  description: `Set the space between the item and the texts in the gallery. Note that this option is relevant
  to galleries with texts separated from the image (texts below image or above image).
  `,
};
