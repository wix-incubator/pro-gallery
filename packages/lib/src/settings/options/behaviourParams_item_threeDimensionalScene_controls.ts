import { INPUT_TYPES } from '../utils/constants';

function createControlsOptions(name: string, defaultValue = true) {
  return {
    [`behaviourParams_item_threeDimensionalScene_controls_enable${name}`]: {
      title: `3D Scene ${name} control`,
      isRelevant: () => true,
      type: INPUT_TYPES.BOOLEAN,
      description: `Set 3D item ${name} control to be enabled or disabled`,
      default: defaultValue,
    },
  };
}

export default {
  ...createControlsOptions('Zoom', false),
  ...createControlsOptions('Pan'),
  ...createControlsOptions('Rotate'),
  ...createControlsOptions('AutoRotate'),
};
