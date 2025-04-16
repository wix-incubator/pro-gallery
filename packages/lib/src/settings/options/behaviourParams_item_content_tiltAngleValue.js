import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Angle of tilt',
  description: `Set the angle of tilt`,
  type: INPUT_TYPES.NUMBER,
  isRelevant: (options) =>
    options[optionsMap.behaviourParams.item.content.hoverAnimation] ===
    GALLERY_CONSTS[optionsMap.behaviourParams.item.content.hoverAnimation].TILT,
  isRelevantDescription: 'Set the item click action to "TILT".',
  default: -4,
};
