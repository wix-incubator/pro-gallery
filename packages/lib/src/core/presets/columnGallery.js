import LAYOUTS from '../../common/constants/layout';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';

export const fixedStyles = {
  galleryLayout: LAYOUTS.COLUMN,
  cubeType: 'fill',
  cubeImages: true,
  cubeRatio: 0.35,
  oneRow: true,
  scrollDirection: SCROLL_DIRECTION.HORIZONTAL,
  isVertical: false,
  groupSize: 1,
  groupTypes: '1',

  // this params were moved from the presets in layoutHelper and were not tested and checked yet.
  smartCrop: false,
  galleryType: 'Strips',
  fixedColumns: 0,
  enableScroll: true,
  isGrid: false,
  isColumns: true,
  isMasonry: false,
  isSlider: false,
  isSlideshow: false,
  cropOnlyFill: false,
}

export const createStyles = styles => {
  return {
    ...styles,
    ...fixedStyles,
    targetItemSize: styles.gallerySize,
  }
}
