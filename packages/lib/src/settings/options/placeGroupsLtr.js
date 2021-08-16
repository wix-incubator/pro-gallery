import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Arrange Items by Columns Order',
  description: `In a columns layout, items will usually arrange by the shortest column. Use this parametr to force a LTR / RTL order (usfull for Grid like layouts)`,
  type: INPUT_TYPES.BOOLEAN,
  isRelevant: (styleParams) =>
    styleParams.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL &&
    styleParams.isVertical,
  isRelevantDescription:
    'Set "Gallery Orientation" to "Columns" & "Scroll Direction" to "Vertical".',
  default: false,
};
