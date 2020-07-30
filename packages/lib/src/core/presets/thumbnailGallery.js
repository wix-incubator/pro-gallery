import LAYOUTS from '../../common/constants/layout';
import PLACEMENTS from '../../common/constants/placements';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';

export const fixedStyles = {
  galleryLayout: LAYOUTS.THUMBNAIL,
  enableInfiniteScroll: true,
  cubeRatio: '100%/100%',
  cubeImages:true,
  oneRow: true,
  titlePlacement: PLACEMENTS.SHOW_ON_HOVER,
  scrollDirection: SCROLL_DIRECTION.HORIZONTAL,
  galleryMargin: 0,
  isVertical: false,
  groupSize: 1,
  groupTypes: '1',

  // this params were moved from the presets in layoutHelper and were not tested and checked yet.
  smartCrop: false,
  galleryType: 'Strips',
  hasThumbnails: true,
  enableScroll: true,
  scrollSnap: true,
  isGrid: false,
  isSlider: false,
  isMasonry: false,
  isColumns: false,
  isSlideshow: false,
  cropOnlyFill: false,
  floatingImages: 0,
  imageMargin: 0,
}

export const createStyles = styles => {
  return {
    ...styles,
    ...fixedStyles,
    targetItemSize: styles.targetItemSize || styles.gallerySize,
  }
}

