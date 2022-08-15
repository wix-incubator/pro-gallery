import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import arrowsPosition from './arrowsPosition';
import layoutParams_navigationArrows_mouseCursorContainerMaxWidth from './layoutParams_navigationArrows_mouseCursorContainerMaxWidth';

export default {
  title: 'Second Media Trigger',
  isRelevant: (options) =>
    !(
      arrowsPosition.isRelevant(options) &&
      options.arrowsPosition === GALLERY_CONSTS.arrowsPosition.MOUSE_CURSOR &&
      options.layoutParams.navigationArrows.mouseCursorContainerMaxWidth ===
        100 &&
      layoutParams_navigationArrows_mouseCursorContainerMaxWidth.isRelevant(
        options
      )
    ),
  isRelevantDescription: 'Allways.',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.secondaryMediaTrigger.OFF,
  options: createOptions('secondaryMediaTrigger'),
  description: `Select the triggering action that will show the second media.`,
};
