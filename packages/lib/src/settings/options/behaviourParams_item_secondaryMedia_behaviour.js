import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import { createOptions } from '../utils/utils.js';
import behaviourParams_item_secondaryMedia_trigger from './behaviourParams_item_secondaryMedia_trigger.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Second Media Behaivour',
  isRelevant: (options) => {
    return (
      behaviourParams_item_secondaryMedia_trigger.isRelevant(options) &&
      options[optionsMap.behaviourParams.item.secondaryMedia.trigger] !==
        GALLERY_CONSTS[optionsMap.behaviourParams.item.secondaryMedia.trigger].OFF
    );
  },
  isRelevantDescription:
    'Secondary Media Trigger is not "OFF" and when arrowsPosition is MOUSE_CURSOR there must be some space to hover (mouseCursorContainerMaxWidth less then 100)',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.behaviourParams.item.secondaryMedia.behaviour].APPEARS,
  get options() {
    return createOptions(optionsMap.behaviourParams.item.secondaryMedia.behaviour);
  },
  description: `Select the behaviour for the second media on action.`,
};
