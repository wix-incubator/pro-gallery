import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Second Media Trigger',
  isRelevant: () => true,
  isRelevantDescription: 'Allways.',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.secondaryMediaTrigger.OFF,
  options: createOptions('secondaryMediaTrigger'),
  description: `Select the triggering action that will show the second media.`,
};
