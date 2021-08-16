import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Groups per Row',
  isRelevant: (styleParams) =>
    styleParams.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL &&
    !styleParams.isVertical &&
    styleParams.gridStyle === 1,
  isRelevantDescription:
    'Set a Vertical gallery ("Scroll Direction" as "Vertical"), set "Layout Orientation" to "Rows" and set "Responsive Type" to "Set Items Per Row".',
  type: INPUT_TYPES.NUMBER,
  default: 0,
  min: 0,
  max: 10,
  description: `Set the number of groups per row in the gallery (relevant only to galleries with vertical scroll).
  `,
};
