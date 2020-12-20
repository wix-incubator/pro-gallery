import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Scroll Snap In Sliding Galleries',
  description: `Choose if you want the closest image to snap in to place when scrolling horizontaly`,
  isRelevant: (styleParams) => styleParams.oneRow,
  isRelevantDescription: 'Set a Horizontal scrolled gallery.',
  type: INPUT_TYPES.BOOLEAN,
  default: false,
};
