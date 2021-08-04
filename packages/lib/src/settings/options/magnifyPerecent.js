import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Level of magnification',
  description: `Set the value of magnification in percents`,
  type: INPUT_TYPES.NUMBER,
  isRelevant: (styleParams) =>
    styleParams.itemClick === GALLERY_CONSTS.itemClick.MAGNIFY,
  isRelevantDescription: 'Set the click action ("itemClick") to "MAGNIFY".',
  default: 1,
};
