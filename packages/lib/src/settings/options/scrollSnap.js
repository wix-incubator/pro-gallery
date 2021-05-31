import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Scroll Snap In Sliding Galleries',
  description: `Choose if you want the closest image to snap in to place when scrolling horizontaly`,
  isRelevant: (styleParams) =>
    styleParams.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal").',
  type: INPUT_TYPES.BOOLEAN,
  default: false,
};
