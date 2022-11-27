import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import optionsMap from '../../core/helpers/optionsMap';

function createTransformOptions(name: string, axis: 'x' | 'y' | 'z') {
  return {
    title: `3D Scene Transform ${name} Axis ${axis.toUpperCase()}`,
    isRelevant: () => true,
    type: INPUT_TYPES.NUMBER,
    default:
      GALLERY_CONSTS[optionsMap.behaviourParams.item.secondaryMedia.trigger]
        .OFF, //NEW STYPEPARAMS METHOD need one source
    options: createOptions(
      optionsMap.behaviourParams.item.secondaryMedia.trigger
    ),
    description: `Select the triggering action that will show the second media.`,
  };
}
