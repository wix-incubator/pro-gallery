import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Navigation arrows container background color',
  isRelevant: (options) => {
    return (
      options[optionsMap.layoutParams.structure.scrollDirection] ===
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .HORIZONTAL &&
      options[optionsMap.layoutParams.navigationArrows.enable] &&
      options[optionsMap.layoutParams.navigationArrows.container.type] ===
        GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.container.type]
          .BOX
    );
  },
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal"), "Show Navigation Arrows" to "true" and Navigation arrows styling ("layoutParams.navigationArrows.container.type") to "BOX".',
  type: INPUT_TYPES.TEXT,
  default: 'rgba(0,0,0,0)',
  description: `Choose the color of the navigating arrows background.
  `,
};
