import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Level of magnification',
  description: `Set the value of magnification`,
  type: INPUT_TYPES.NUMBER,
  isRelevant: (styleParams) =>
    styleParams.itemClick === GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].MAGNIFY,
  isRelevantDescription: 'Set the item click action to "MAGNIFY".',
  default: 2,
};
