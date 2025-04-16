import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Text Box Width Units',
  description: `Set the text box width in pixels or as a percent from the column width and height.`,
  isRelevant: (options) => {
    return (
      options[optionsMap.layoutParams.structure.layoutOrientation] ===
        GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation].VERTICAL &&
      options[optionsMap.layoutParams.groups.groupSize] === 1 &&
      options[optionsMap.layoutParams.structure.scrollDirection] ===
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL &&
      GALLERY_CONSTS.hasExternalHorizontalPlacement(options[optionsMap.layoutParams.info.placement])
    );
  },
  type: INPUT_TYPES.OPTIONS,
  get options() {
    return createOptions(optionsMap.layoutParams.info.sizeUnits);
  },
  default: GALLERY_CONSTS[optionsMap.layoutParams.info.sizeUnits].PERCENT,
};
