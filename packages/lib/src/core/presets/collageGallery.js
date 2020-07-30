import LAYOUTS from '../../common/constants/layout';
import PLACEMENTS from '../../common/constants/placements';

export const fixedStyles = {
  galleryLayout: LAYOUTS.COLLAGE,
  cubeImages: false,
  titlePlacement: PLACEMENTS.SHOW_ON_HOVER,
  groupSize: 3,
  hasThumbnails: false,
  groupTypes: '1,2h,2v,3t,3b,3l,3r',
  // this params were moved from the presets in layoutHelper and were not tested and checked yet.
  targetItemSize: 0,
  fixedColumns: 0,
  enableScroll: true,
  isGrid: false,
  isSlider: false,
  isMasonry: false,
  isColumns: false,
  isSlideshow: false,
  cropOnlyFill: false,
}

export const createStyles = styles => {
  return {
    ...styles,
    ...fixedStyles,
    targetItemSize: Math.round(styles.gallerySize * 5 + 500),
  }
}
