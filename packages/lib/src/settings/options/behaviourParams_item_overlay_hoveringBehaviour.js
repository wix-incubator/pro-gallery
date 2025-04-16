import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Hover Effect',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoveringBehaviour].APPEARS,
  get options() {
    return createOptions(optionsMap.behaviourParams.item.overlay.hoveringBehaviour);
  },
  description: `Determines whether the info appears or disappears or always shown or never shown on when hovering over items.
  `,
};
