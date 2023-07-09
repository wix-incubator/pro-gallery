import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Scroll Snap In Sliding Galleries',
  description: `Choose if you want the closest image to snap in to place when scrolling horizontally`,
  isRelevant: (options) =>
    options[optionsMap.layoutParams.structure.scrollDirection] ===
    GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL,
  isRelevantDescription: 'Set a Horizontal gallery ("Scroll Direction" as "Horizontal").',
  type: INPUT_TYPES.BOOLEAN,
  default: false, //one source
};
