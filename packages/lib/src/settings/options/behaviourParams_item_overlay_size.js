import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Overlay Size',
  description: `Size`,
  isRelevantDescription: 'Set "Hover Effect" to anything but "Never Show".',
  isRelevant: (options) =>
    options[optionsMap.behaviourParams.item.overlay.hoveringBehaviour] !==
    GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoveringBehaviour].NEVER_SHOW,
  type: INPUT_TYPES.NUMBER,
  min: 0,
  default: 100,
};
