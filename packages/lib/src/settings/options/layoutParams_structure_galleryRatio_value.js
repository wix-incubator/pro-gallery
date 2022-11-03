import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';
import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Gallery Ratio',
  description: `This option allows horizontally scrolled galleries to link their height to the width of the gallery by the provided ratio`,
  isRelevant: (options) => {
    if (options.newSPs) {
      return (
        options[optionsMap.layoutParams.structure.scrollDirection] ===
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .HORIZONTAL
      );
    } else {
      return (
        options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL //NEW STYPEPARAMS METHOD replace to new sp scrollDirection
      );
    }
  },
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal")',
  default: 0,
  type: INPUT_TYPES.NUMBER,
};
