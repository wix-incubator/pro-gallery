import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Navigation arrows container background color',
  isRelevant: (options) => {
    if (options.newSPs) {
      return (
        options[optionsMap.layoutParams.structure.scrollDirection] ===
          GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
            .HORIZONTAL && //NEW STYPEPARAMS METHOD change to the new sp const
        options[optionsMap.layoutParams.navigationArrows.enable] &&
        options[optionsMap.layoutParams.navigationArrows.container.type] ===
          GALLERY_CONSTS[
            optionsMap.layoutParams.navigationArrows.container.type
          ].BOX //NEW STYPEPARAMS METHOD use new sps
      ); //NEW STYPEPARAMS METHOD use new sps
    } else {
      return (
        options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
        options.showArrows &&
        options.layoutParams_navigationArrows_container_type ===
          GALLERY_CONSTS.arrowsContainerStyleType.BOX //NEW STYPEPARAMS METHOD use new sps
      ); //NEW STYPEPARAMS METHOD use new sps
    }
  },
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal"), "Show Navigation Arrows" to "true" and Navigation arrows styling ("layoutParams.navigationArrows.container.type") to "BOX".',
  type: INPUT_TYPES.TEXT,
  default: 'rgba(0,0,0,0)',
  description: `Choose the color of the navigating arrows background.
  `,
};
