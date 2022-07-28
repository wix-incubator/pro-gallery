import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Second Media Behaivour',
  isRelevant: (sp) =>
    sp.behaviourParams_item_secondaryMedia_trigger !==
    GALLERY_CONSTS.secondaryMediaTrigger.OFF,
  isRelevantDescription:
    '"Second Media Trigger" must be set to anything but "OFF".',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.secondaryMediaBehaviour.APPEARS,
  options: createOptions('secondaryMediaBehaviour'),
  description: `Select the behaviour for the second media on action.`,
};
