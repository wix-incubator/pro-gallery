import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Number Of Columns',
  description: `Set a fixed number of columns in the gallery. Note that this option relies on the options isVertical (set to "true")
  and scrollDirection being vertical.`,
  isRelevantDescription:
    'Set a Vertical gallery ("Scroll Direction" as "Vertical"), set "Layout Orientation" to "columns" and set "Responsive Type" to "Set Items Per Row".',
  isRelevant: (styleParams) =>
    styleParams.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL &&
    styleParams.isVertical &&
    styleParams.gridStyle === 1,
  type: INPUT_TYPES.NUMBER,
  default: 0,
};
