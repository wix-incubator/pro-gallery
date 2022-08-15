import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import behaviourParams_item_secondaryMedia_trigger from './behaviourParams_item_secondaryMedia_trigger';

export default {
  title: 'Second Media Behaivour',
  isRelevant: (sp) =>
    behaviourParams_item_secondaryMedia_trigger.isRelevant(sp) &&
    sp.behaviourParams.item.secondaryMedia.trigger !==
      GALLERY_CONSTS.secondaryMediaTrigger.OFF,
  isRelevantDescription:
    '"Second Media Trigger" must be set to anything but "OFF".',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.secondaryMediaBehaviour.APPEARS,
  options: createOptions('secondaryMediaBehaviour'),
  description: `Select the behaviour for the second media on action.`,
};
