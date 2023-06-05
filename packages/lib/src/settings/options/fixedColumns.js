import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Number Of Columns',
  description: `Set a fixed number of columns in the gallery. Note that this option relies on the options isVertical (set to "true")
  and scrollDirection being vertical.`,
  isRelevantDescription:
    'Set a Vertical gallery ("Scroll Direction" as "Vertical"), set "Layout Orientation" to "columns" and set "Responsive Type" to "Set Items Per Row".',
  isRelevant: (options) =>
    options.scrollDirection === GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL &&
    options.isVertical &&
    options.gridStyle === 1,
  type: INPUT_TYPES.NUMBER,
  default: 0,
};
