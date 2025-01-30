export default disableAnimationsForSlideshowLayouts;

import optionsMap from '../helpers/optionsMap.js';
import { GALLERY_CONSTS } from '../../index.js';

function disableAnimationsForSlideshowLayouts(presetOptions) {
  presetOptions[optionsMap.behaviourParams.item.content.placementAnimation] =
    GALLERY_CONSTS[optionsMap.behaviourParams.item.content.placementAnimation].NO_EFFECT;
  presetOptions[optionsMap.behaviourParams.item.overlay.hoverAnimation] =
    GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoverAnimation].NO_EFFECT;
  presetOptions[optionsMap.behaviourParams.item.content.hoverAnimation] =
    GALLERY_CONSTS[optionsMap.behaviourParams.item.content.hoverAnimation].NO_EFFECT;
}
