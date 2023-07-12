import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Overlay Position',
  description: `The position of the overlay`,
  isRelevantDescription: 'Set "Hover Effect" to anything but "Never Show".',
  isRelevant: (options) => {
    return (
      options[optionsMap.behaviourParams.item.overlay.hoveringBehaviour] !==
      GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoveringBehaviour].NEVER_SHOW
    );
  },
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.position].LEFT,
  get options() {
    return createOptions(optionsMap.behaviourParams.item.overlay.position);
  },
};
