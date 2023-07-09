import { INPUT_TYPES } from '../utils/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Group By Orientation',
  isRelevant: (options) => options[optionsMap.layoutParams.groups.groupSize] > 1,
  isRelevantDescription: 'Set "Max Group Size" to be greater than "1".',
  type: INPUT_TYPES.BOOLEAN,
  default: true,
  description: `When true, the gallery will choose the best way to arrange the groups according
  to the proportions of the items.
  `,
};
