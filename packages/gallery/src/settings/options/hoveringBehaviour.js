import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Hover Effect',
  isRelevant: (styleParams)  => styleParams.allowHover,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.infoBehaviourOnHover.APPEARS,
  options: createOptions('infoBehaviourOnHover'),
  description: `Determines whether the hover container appear or disappear when hovering over items.
  `,
}