import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Time Between Images',
  description: `Set an interval time when using autoSlide, to have an auto sliding gallery. `,
  min: 2,
  max: 30,
  isRelevant: (styleParams) =>
    styleParams.isAutoSlideshow && styleParams.oneRow,
  type: INPUT_TYPES.NUMBER,
  isRelevantDescription:
    'set a Horizontal scrolled gallery, set "Auto Slide" to "true".',
  default: 4,
};
