import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Responsive Type',
  isRelevant: (options) => {
    return (
      options[optionsMap.layoutParams.structure.scrollDirection] ===
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL &&
      options[optionsMap.layoutParams.structure.layoutOrientation] ===
        GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation].VERTICAL
    );
  },
  isRelevantDescription:
    'Set a Vertical gallery ("Scroll Direction" as "Vertical") and set "Layout Orientation" to "Columns".',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.layoutParams.structure.responsiveMode].FIT_TO_SCREEN,
  get options() {
    return createOptions(optionsMap.layoutParams.structure.responsiveMode);
  },
  description: `Choose between adjusting the number of columns addording to the container
  size or setting it manually and keep it fixed.`,
  alert: 'This option will disable the responsive feature of the gallery!',
};
