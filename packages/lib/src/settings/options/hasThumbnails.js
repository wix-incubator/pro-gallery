import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Slider Thumbnails',
  isRelevant: (styleParams)  => styleParams.oneRow,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
  description: `Choose if you want to have slider thumbnails in the gallery. Note that this option is relevant only
  to galleries that render the slideShowView component.
  `,
}
