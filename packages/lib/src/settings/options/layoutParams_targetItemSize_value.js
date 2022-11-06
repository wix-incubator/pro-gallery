import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Item Size (smart)',
  description: `Set the item size between 1 to 100 units. The real size will be determined by the layout.`,
  isRelevant: (options) => {
    if (options.newSPs) {
      return (
        options[optionsMap.layoutParams.structure.scrollDirection] ===
          GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
            .VERTICAL && // why is it only in vertical galleries
        options[optionsMap.layoutParams.structure.responsiveMode] !==
          GALLERY_CONSTS[optionsMap.layoutParams.structure.responsiveMode]
            .FIT_TO_SCREEN
      );
    } else {
      return (
        options.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL && //NEW STYPEPARAMS METHOD check that this is a true isRelevant... why is it only in vertical galleries
        options.gridStyle !== 1
      );
    }
  },
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set Responsive Type to Fit to screen',
  default: 30,
};
