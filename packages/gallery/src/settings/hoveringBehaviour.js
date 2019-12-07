import { GALLERY_CONSTS, INPUT_TYPES } from './utils/constants';
import { createOptions, always } from './utils/utils';

export default {
  title: 'Hover Effect',
  isRelevant: always,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.infoBehaviourOnHover.APPEARS,
  options: createOptions('hoveringBehaviour'),
  description: `Determines whether the texts appear or disappear when hovering over items.
  `,
}