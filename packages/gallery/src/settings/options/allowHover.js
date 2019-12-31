import { INPUT_TYPES } from '../utils/constants';
import { isInPreset } from '../../components/helpers/layoutHelper';

export default {
  title: 'Allow Hover',
  description: `Choose wheather you want any hover effect to be enabled. Note that this option will result in not rendering the
  item's hovering container which contains the buttons and social icons (love, download and social)`,
  isRelevant: (styleParams) => !isInPreset(styleParams,'allowHover'),
  type: INPUT_TYPES.BOOLEAN,
  default: true,
}