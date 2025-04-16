import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Play Video On',
  description: `Choose when video items will start playing: On hover, on click or autoplay`,
  isRelevant: (options, option) => {
    // Distribution of the specific isRelevant functions
    const videoPlayOptions = {
      [GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].AUTO]: () => {
        return true;
      },
      [GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].HOVER]: () => {
        return true;
      },
      [GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].CLICK]: () => {
        return true;
      },
    };

    // specific option isRelevant : general video play isRelevant (AUTO always true)
    return option ? videoPlayOptions[option](options) : Object.values(videoPlayOptions).some((val) => val(options));
  },
  isRelevantDescription: 'Always Relevant',
  get options() {
    return createOptions(optionsMap.behaviourParams.item.video.playTrigger);
  },
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].HOVER, //one source
};
