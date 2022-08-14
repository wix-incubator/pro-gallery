import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import { default as layoutParams_navigationArrows_mouseCursorContainerMaxWidth } from './layoutParams_navigationArrows_mouseCursorContainerMaxWidth';

export default {
  title: 'Play Video On',
  description: `Choose when video items will start playing: On hover, on click or autoplay`,
  isRelevant: (options, option) => {
    // specific isRelevant function
    const isVideoPlayAbleToPlay = (options) => {
      return !(
        options.layoutParams_navigationArrows_mouseCursorContainerMaxWidth ===
          100 &&
        layoutParams_navigationArrows_mouseCursorContainerMaxWidth.isRelevant(
          options
        )
      );
    };
    // Distribution of the specific isRelevant functions
    const videoPlayOptions = {
      AUTO: () => {
        return true;
      },
      HOVER: isVideoPlayAbleToPlay,
      ON_CLICK: isVideoPlayAbleToPlay,
    };
    // specific option isRelevant : general video play isRelevant (AUTO always true)
    return option
      ? videoPlayOptions[option](options)
      : Object.values(videoPlayOptions).some((val) => val(options));
  },
  isRelevantDescription:
    'in case of HOVER or ON_CLICK - set "Arrows Position" to anything but "Mouse Cursor" (ON_GALLERY or OUTSIDE_GALLERY)',
  options: createOptions('videoPlay'),
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.videoPlay.HOVER,
};
