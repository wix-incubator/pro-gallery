import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Text Box Height (Pixels)',
  description: `Set the text box Height when the texts are above or below the item`,
  isRelevantDescription:
    'First set a Vertical gallery ("Scroll Direction" as "Vertical").\nThen set "Layout Orientation" to "Columns".\nThen set "Max Group Size" to "1".\nThen set "Texts Placement" to "Show Below" or "Show Above".',
  isRelevant: (options) => {
    return (
      ((options[optionsMap.layoutParams.structure.layoutOrientation] ===
        GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation].VERTICAL &&
        options[optionsMap.layoutParams.structure.scrollDirection] ===
          GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL) ||
        options[optionsMap.layoutParams.structure.scrollDirection] ===
          GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL) &&
      options[optionsMap.layoutParams.groups.groupSize] === 1 &&
      GALLERY_CONSTS.hasExternalVerticalPlacement(options[optionsMap.layoutParams.info.placement])
    );
  },
  type: INPUT_TYPES.NUMBER,
  default: 200,
  min: 0,
  max: 1000,
};
