import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import { default as layoutParams_navigationArrows_position } from './layoutParams_navigationArrows_position.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Navigation Arrows Padding',
  isRelevant: (options) =>
    layoutParams_navigationArrows_position.isRelevant(options) &&
    options[optionsMap.layoutParams.navigationArrows.position] ===
      GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.position].ON_GALLERY,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal"), set "Show Navigation Arrows" to "true" ans set "Navigation Arrows Position" to "On Gallery"',
  type: INPUT_TYPES.NUMBER,
  min: 0,
  max: 100,
  default: 23,
  description: `Set the left / right padding of the navigation arrows in pixels.`,
};
