import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Hover Effect',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.infoBehaviourOnHover.APPEARS,
  options: createOptions('infoBehaviourOnHover'),
  description: `Determines whether the info appears or disappears or always shown or never shown on when hovering over items.
  `,
};
