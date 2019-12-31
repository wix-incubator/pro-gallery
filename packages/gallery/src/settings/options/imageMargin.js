import { INPUT_TYPES } from '../utils/constants';
import { isInPreset } from '../../components/helpers/layoutHelper';

export default {
  title: 'Spacing Between Items',
  description: `Set the margin between items.
    This option is not relevant to some layouts: Slideshow, Thumbnails.`,
  isRelevant: (styleParams) => !isInPreset(styleParams,'imageMargin'),
  type: INPUT_TYPES.NUMBER,
  default: 10,
}