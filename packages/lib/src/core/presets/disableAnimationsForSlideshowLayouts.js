export default disableAnimationsForSlideshowLayouts;

import IMAGE_PLACEMENT_ANIMATIONS from '../../common/constants/imagePlacementAnimations';
import IMAGE_HOVER_ANIMATIONS from '../../common/constants/imageHoverAnimations';
import OVERLAY_ANIMATIONS from '../../common/constants/overlayAnimations';

function disableAnimationsForSlideshowLayouts(presetOptions) {
  presetOptions.imagePlacementAnimation = IMAGE_PLACEMENT_ANIMATIONS.NO_EFFECT;
  presetOptions.overlayAnimation = OVERLAY_ANIMATIONS.NO_EFFECT;
  presetOptions.imageHoverAnimation = IMAGE_HOVER_ANIMATIONS.NO_EFFECT;
}
