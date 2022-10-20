//NEW STYPEPARAMS METHOD

import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Allowed Group Types',
  isRelevant: (options) =>
    options[optionsMap.layoutParams.groups.groupSize] > 1,
  isRelevantDescription: 'Set "Max Group Size" to be greater than 1.',
  type: INPUT_TYPES.MULTISELECT,
  default: Object.keys(GALLERY_CONSTS.groupTypes).toString(), //NEW STYPEPARAMS METHOD check why this is the def
  options: createOptions('groupTypes'), //NEW STYPEPARAMS METHOD check that this is relevant for the new type - change to file layoutParams_groups_allowedGroupTypes
  description: `The allowed group types in collage. This is an advance option that gives you more control over
  the layout of the gallery by specifying the groups you want in the gallery (e.g: "1" - groups of 1 item, "2v" - groups of 2 vertical items
  and more...).
  `,
};
