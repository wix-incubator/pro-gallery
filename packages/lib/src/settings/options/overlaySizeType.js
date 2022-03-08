import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Overlay Size Type',
  description: `choose pixel or percent`,
  isRelevantDescription: 'Set "Texts Placement" to "Show On Hover".',
  isRelevant: (options) =>
    options.hoveringBehaviour !==
    GALLERY_CONSTS.infoBehaviourOnHover.NEVER_SHOW,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.overlaySizeType.PERCENT,
  options: createOptions('overlaySizeType'),
};
