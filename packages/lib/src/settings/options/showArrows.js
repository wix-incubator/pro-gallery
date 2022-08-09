import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { default as scrollDirection } from './scrollDirection';
export default {
  title: 'Show Navigation Arrows',
  description: `Choose if you want to have navigation arrows in a sliding gallery`,
  isRelevant: (options) =>
    scrollDirection.isRelevant(options) &&
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal").',
  type: INPUT_TYPES.BOOLEAN,
  default: true,
};
