import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Item Border Color',
  description: `Set the border color for each item in the gallery.`,
  isRelevant: (styleParams) => styleParams.hoveringBehaviour !== GALLERY_CONSTS.infoBehaviourOnHover.NEVER_SHOW,
  type: INPUT_TYPES.NUMBER,
  default: 0,
}