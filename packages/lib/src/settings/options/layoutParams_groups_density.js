import { INPUT_TYPES } from '../utils/constants';
import optionsMap from '../../core/helpers/optionsMap';
export default {
  title: 'Collage Group Density',
  description: `Determines how dense the collaging and grouping of images will be. Note that in order for this option to take any effect,
  the option "groupSize" needs to be set to more than 1`,
  isRelevant: (options) => options[optionsMap.layoutParams.groups.groupSize] > 1,
  isRelevantDescription: 'Set "Max Group Size" to be greater than "1".',
  type: INPUT_TYPES.NUMBER,
  default: 0.8,
  min: 0,
  max: 1,
  step: 0.1,
};
