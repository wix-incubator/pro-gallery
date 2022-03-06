import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Texts Placement',
  isRelevantDescription:
    'Set "Layout Orientation" to "Columns" and set "Max Group Size" to "1".',
  isRelevant: (options, option) => {
    // specific isRelevant functions
    const isHorizontalInfoCompatibleLayout = (options) => {
      return (
        options['isVertical'] &&
        options['groupSize'] === 1 &&
        options['scrollDirection'] === 0
      );
    };
    const isVerticalInfoCompatibleLayout = (options) => {
      return {
        0: options['isVertical'] && options['groupSize'] === 1,
        1: options['groupSize'] === 1,
      }[options['scrollDirection']];
    };
    // Distribution of the specific isRelevant functions
    const placementOptions = {
      OVERLAY: () => {
        return true;
      },
      BELOW: isVerticalInfoCompatibleLayout,
      ABOVE: isVerticalInfoCompatibleLayout,
      RIGHT: isHorizontalInfoCompatibleLayout,
      LEFT: isHorizontalInfoCompatibleLayout,
      ALTERNATE_HORIZONTALLY: isHorizontalInfoCompatibleLayout,
      ALTERNATE_VERTICALLY: isVerticalInfoCompatibleLayout,
    };
    // specific option isRelevant : general titlePlacement isRelevant (Hover always true)
    return option ? placementOptions[option](options) : true;
  },
  type: INPUT_TYPES.MULTISELECT,
  default: GALLERY_CONSTS.placements.SHOW_ON_HOVER,
  options: createOptions('placements'),
  description: `Choose the the placement of the texts (title and description) relative to the items in the gallery. 
  Notes: 
   - this option also deals with the hover effects and may overide "hoveringBehaviour" when set to anything but "SHOW_ON_HOVER". 
   - you can select multiple values, but only one of each direction (ABOVE / BELOW, RIGHT / LEFT)
  `,
};
