import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Overlay Padding',
  description: `Padding`,
  isRelevantDescription: 'Set "Hover Effect" to anything but "Never Show".',
  isRelevant: (options) =>
    options.hoveringBehaviour !==
    GALLERY_CONSTS.infoBehaviourOnHover.NEVER_SHOW,
  type: INPUT_TYPES.NUMBER,
  min: 0,
  default: 0,
};
