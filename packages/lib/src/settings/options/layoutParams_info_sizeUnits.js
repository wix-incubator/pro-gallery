import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Text Box Width Units',
  description: `Set the text box width in pixels or as a percent from the column width and height.`,
  isRelevant: (options) => {
    if (options.newSPs) {
      return (
        options[optionsMap.layoutParams.structure.layoutOrientation] ===
          GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation]
            .VERTICAL &&
        options[optionsMap.layoutParams.groups.groupSize] === 1 &&
        options[optionsMap.layoutParams.structure.scrollDirection] ===
          GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
            .VERTICAL &&
        GALLERY_CONSTS.hasExternalHorizontalPlacement(
          options[optionsMap.layoutParams.info.placement]
        ) //NEW STYPEPARAMS METHOD need to change to new sps here
      );
    } else {
      return (
        options.isVertical &&
        options.groupSize === 1 &&
        options.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL &&
        GALLERY_CONSTS.hasExternalHorizontalPlacement(options.titlePlacement) //NEW STYPEPARAMS METHOD need to change to new sps here
      );
    }
  },
  type: INPUT_TYPES.OPTIONS,
  options: createOptions('textBoxWidthCalculationOptions'), //NEW STYPEPARAMS METHOD need to change to new sp
  default: GALLERY_CONSTS.textBoxWidthCalculationOptions.PERCENT, //NEW STYPEPARAMS METHOD need to change to new sp
};
