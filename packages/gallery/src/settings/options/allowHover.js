import { INPUT_TYPES } from '../utils/constants';


export default {
  title: 'Allow Hover',
  description: `Choose wheather you want any hover effect to be enabled. Note that this option will result in not rendering the
  item's hovering container which contains the customHoverRenderer`,
  isRelevant: () => true,
  type: INPUT_TYPES.BOOLEAN,
  default: true,
}
