import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';
import { isInPreset } from '../../components/helpers/layoutHelper';

export default {
  title: 'Hover Effect',
  isRelevant: (styleParams)  => !isInPreset(styleParams,'hoveringBehaviour'),
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.infoBehaviourOnHover.APPEARS,
  options: createOptions('infoBehaviourOnHover'),
  description: `Determines whether the hover container appear or disappear when hovering over items.
  `,
}