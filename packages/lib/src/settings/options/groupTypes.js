import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Allowed Group Types',
  isRelevant: (styleParams) => styleParams.groupSize > 1,
  isRelevantDescription: 'Set "Max Group Size" to be greater than 1',
  type: INPUT_TYPES.MULTISELECT,
  default: Object.keys(GALLERY_CONSTS.groupTypes).toString(),
  options: createOptions('groupTypes'),
  description: `The allowed group types in collage. This is an advance option that gives you more control over
  the layout of the gallery by specifying the groups you want in the gallery (e.g: "1" - groups of 1 item, "2v" - groups of 2 vertical items
  and more...).
  `,
};
