import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Item Size (smart)',
  description: `Set the item size between 1 to 100 units. The real size will be determined by the layout.`,
  isRelevant: (options) => {
    return (
      options[optionsMap.layoutParams.structure.scrollDirection] ===
      GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL
    );
  },
  isRelevantDescription:
    'Set a VERTICAL gallery ("Scroll Direction" as "Vertical") and set Responsive Type to Fit to screen',
  default: 30,
};
