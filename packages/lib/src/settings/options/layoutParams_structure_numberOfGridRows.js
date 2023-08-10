import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Number of Images Per Column (Horizontal Grid Layout Only)',
  description: `This option sets the number of images per a column. This option is currently supported only by Grid layout`,
  type: INPUT_TYPES.NUMBER,
  isRelevant: (options) =>
    options[optionsMap.layoutParams.structure.scrollDirection] ===
    GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL,
  isRelevantDescription: 'Set a Horizontal gallery ("Scroll Direction" as "Horizontal").',
  default: 1, //one source
};
