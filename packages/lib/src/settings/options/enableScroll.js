import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Enable Scroll',
  description: `This option decides if there will be any scrolling in a sliding gallery`,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal").',
  isRelevant: (styleParams) =>
    styleParams.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL,
  type: INPUT_TYPES.BOOLEAN,
  default: true,
};
