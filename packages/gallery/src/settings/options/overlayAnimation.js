import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Overlay Hover Animation',
  isRelevant: (styleParams) =>
    styleParams.hoveringBehaviour !== GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE &&
    styleParams.hoveringBehaviour !== GALLERY_CONSTS.infoBehaviourOnHover.NEVER_SHOW,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.overlayAnimations.NO_EFFECT,
  options: createOptions('overlayAnimations'),
  description: `Choose the overlay animation effect to be used when hovering over an item`,
}