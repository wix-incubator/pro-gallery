import LAYOUTS from '../../common/constants/layout';
import INFO_BEHAVIOUR_ON_HOVER from '../../common/constants/infoBehaviourOnHover';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import {calcTargetItemSize} from '../helpers/layoutHelper';

export const fixedStyles = {
  galleryLayout: LAYOUTS.SLIDESHOW,
  enableInfiniteScroll: true,
  cubeRatio: '100%/100%',
  cubeImages: true,
  oneRow: true,
  hoveringBehaviour: INFO_BEHAVIOUR_ON_HOVER.NEVER_SHOW,
  scrollDirection: SCROLL_DIRECTION.HORIZONTAL,
  galleryMargin: 0,
  isVertical: false,
  groupSize: 1,
  groupTypes: '1',
  itemBorderWidth: 0,
  itemBorderRadius: 0,
  itemBorderColor: undefined,

  // this params were moved from the presets in layoutHelper and were not tested and checked yet.
  smartCrop: false,
  targetItemSize: 550,
  galleryType: 'Strips',
  fixedColumns: 1,
  hasThumbnails: false,
  enableScroll: true,
  scrollSnap: true,
  isGrid: false,
  isColumns: false,
  isMasonry: false,
  isSlider: false,
  isSlideshow: true,
  cropOnlyFill: false,
  floatingImages: 0,
  imageMargin: 0,
}

export const createStyles = styles => {
  return {
    ...styles,
    ...fixedStyles,
    targetItemSize: calcTargetItemSize(styles),
  }
}
