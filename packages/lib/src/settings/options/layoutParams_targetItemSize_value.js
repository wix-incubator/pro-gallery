import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';
import layoutParams_structure_responsiveMode from './layoutParams_structure_responsiveMode';

export default {
  title: 'Item Size (smart)',
  description: `Set the item size between 1 to 100 units. The real size will be determined by the layout.`,
  isRelevant: (options) => {
    return (
      //is vertical layout and fit to screen?
      //if the responsive mode is irrelevant, return true (because we don't need to check it). Otherwise, check if it's fit to screen
      (options[optionsMap.layoutParams.structure.scrollDirection] ===
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL &&
        (!layoutParams_structure_responsiveMode.isRelevant(options) ||
          options[optionsMap.layoutParams.structure.responsiveMode] ===
            GALLERY_CONSTS[optionsMap.layoutParams.structure.responsiveMode].FIT_TO_SCREEN)) ||
      //is horizontal collage?
      //(the only horizontal layout we want it to be relevant in is collage, and its only relevant for group size > 1.
      //But in horizontal grid, if the numberOfGridRows is more than 1, it changes the group size.
      //So the way to handle it is to make sure that the groupSize > 1 not because of numberOfGridRows)
      (options[optionsMap.layoutParams.structure.scrollDirection] ===
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL &&
        options[optionsMap.layoutParams.groups.groupSize] > 1 &&
        options[optionsMap.layoutParams.structure.numberOfGridRows] <= 1)
    );
  },
  isRelevantDescription:
    'Set a Vertical gallery ("Scroll Direction" as "Vertical") and set Responsive Type to Fit to screen, or set a Collage layout with "Horizontal" Scroll Direction.',
  default: 30,
};
