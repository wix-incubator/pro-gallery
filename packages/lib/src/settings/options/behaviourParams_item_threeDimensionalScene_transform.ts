import { INPUT_TYPES } from '../utils/constants';

function createTransformOptions(name: string, axis: 'x' | 'y' | 'z') {
  return {
    [`behaviourParams_item_transform_${name}_${axis}`]: {
      title: `3D Scene Transform ${name} Axis ${axis.toUpperCase()}`,
      isRelevant: () => true,
      type: INPUT_TYPES.NUMBER,
      description: `Set 3D item transform ${name} axis ${axis.toUpperCase()}`,
    },
  };
}

export default {
  ...createTransformOptions('rotation', 'x'),
  ...createTransformOptions('rotation', 'y'),
  ...createTransformOptions('rotation', 'z'),
  ...createTransformOptions('scale', 'x'),
  ...createTransformOptions('scale', 'y'),
  ...createTransformOptions('scale', 'z'),
  ...createTransformOptions('translation', 'x'),
  ...createTransformOptions('translation', 'y'),
  ...createTransformOptions('translation', 'z'),
};
