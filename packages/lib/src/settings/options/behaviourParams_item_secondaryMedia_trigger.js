import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Second Media Trigger',
  isRelevant: () => true,
  isRelevantDescription: 'Not relevant when arowsPosition is MOUSE_CURSOR and mouseCursorContainerMaxWidth is 100',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.behaviourParams.item.secondaryMedia.trigger].OFF, //one source
  get options() {
    return createOptions(optionsMap.behaviourParams.item.secondaryMedia.trigger);
  },
  description: `Select the triggering action that will show the second media.`,
};
