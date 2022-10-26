//NEW STYPEPARAMS METHOD
import { INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';
import optionsMap from '../../core/helpers/optionsMap';
import { flatV4DefaultOptions } from '../../common/v4DefaultOptions';
export default {
  title: 'Scroll Direction',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.OPTIONS,
  default:
    flatV4DefaultOptions[optionsMap.layoutParams.structure.scrollDirection],
  options: createOptions(optionsMap.layoutParams.structure.scrollDirection),
  description: `Toggle between two types of galleries. Vertical and Horizontal. Notice that many options are available only for a specific scroll direction.`,
};
