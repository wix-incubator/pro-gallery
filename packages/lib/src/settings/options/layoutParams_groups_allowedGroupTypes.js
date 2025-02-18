import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import { createOptions } from '../utils/utils.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Allowed Group Types',
  isRelevant: (options) => options[optionsMap.layoutParams.groups.groupSize] > 1,
  isRelevantDescription: 'Set "Max Group Size" to be greater than 1.',
  type: INPUT_TYPES.MULTISELECT,
  default: Object.keys(GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]), //v5 might need to change to a new const exported
  get options() {
    return createOptions(optionsMap.layoutParams.groups.allowedGroupTypes);
  },
  description: `The allowed group types in collage. This is an advance option that gives you more control over
  the layout of the gallery by specifying the groups you want in the gallery (e.g: "1" - groups of 1 item, "2v" - groups of 2 vertical items
  and more...).
  `,
};
