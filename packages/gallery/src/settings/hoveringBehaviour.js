import { GALLERY_CONSTS, INPUT_TYPES } from './utils/constants';
import { createOptions, always } from './utils/utils';

export default {
  title: 'Hover Effect',
  isRelevant: always,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.infoBehaviourOnHover.APPEARS,
  options: createOptions('hoveringBehaviour'),
  description: `Determines whether the hover container appear or disappear when hovering over items. Note that
  this option is not the only one that deals with the hover event. When "titlePlacement" option is anything but "SHOW_ON_HOVER",
  it will take priority over "hoveringBehaviour".
  `,
}