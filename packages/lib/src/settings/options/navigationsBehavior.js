import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Navigations Behavior',
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal").',
  isRelevant: (options) =>
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL,
  type: INPUT_TYPES.OPTIONS,
  options: createOptions('navigationsBehavior'),
  default: GALLERY_CONSTS.navigationsBehavior.ARROWS,
};
