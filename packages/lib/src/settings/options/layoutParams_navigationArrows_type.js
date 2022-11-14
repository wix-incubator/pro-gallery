import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Arrows Type',
  isRelevant: (options) => {
    if (options.newSPs) {
      return (
        options[optionsMap.layoutParams.structure.scrollDirection] ===
          GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
            .HORIZONTAL && //NEW STYPEPARAMS METHOD change to the new sp const
        options[optionsMap.layoutParams.navigationArrows.enable]
      ); //NEW STYPEPARAMS METHOD use new sps
    } else {
      return (
        options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
        options.showArrows
      ); //NEW STYPEPARAMS METHOD use new sps
    }
  },
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Show Navigation Arrows" to "true".',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.arrowsType.DEFAULT_ARROW,
  options: createOptions('arrowsType'),
  description: `Set the type of arrows you want to display in horizontal galleries`,
};
