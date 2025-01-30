import { INPUT_TYPES } from '../utils/constants.js';

function createTransformOptions(name: string, defaultValue = 0) {
  return {
    [`behaviourParams_item_threeDimensionalScene_transform_${name}`]: {
      title: `3D Scene Transform ${name}`,
      isRelevant: () => true,
      type: INPUT_TYPES.TRANSFORM,
      description: `Set 3D item transform ${name}`,
      default: `${defaultValue}x${defaultValue}y${defaultValue}z${defaultValue}`,
    },
  };
}

export default {
  ...createTransformOptions('rotation'),
  ...createTransformOptions('scale', 1),
  ...createTransformOptions('position'),
};
