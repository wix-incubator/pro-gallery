import { INPUT_TYPES } from '../utils/constants';
import { allowHover } from '../utils/utils';

export default {
  title: 'Allow Hover',
  description: `Choose wheather you want any hover effect to be enabled. Note that this option will result in not rendering the
  item's hovering container which contains the buttons and social icons (love, download and social)`,
  isRelevant: allowHover,
  type: INPUT_TYPES.BOOLEAN,
  default: true,
}