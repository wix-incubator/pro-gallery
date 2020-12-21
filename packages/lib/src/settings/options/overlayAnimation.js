import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Overlay Hover Animation',
  isRelevantDescription:
    'Set "Hover Effect" to anything but "No Change" or "Never Show"',
  isRelevant: (styleParams) =>
    styleParams.hoveringBehaviour !==
      GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE &&
    styleParams.hoveringBehaviour !==
      GALLERY_CONSTS.infoBehaviourOnHover.NEVER_SHOW,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.overlayAnimations.NO_EFFECT,
  options: createOptions('overlayAnimations'),
  description: `Choose the overlay animation effect to be used when hovering over an item`,
};
