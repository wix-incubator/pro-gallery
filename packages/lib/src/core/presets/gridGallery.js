import LAYOUTS from '../../common/constants/layout';

export const fixedStyles = {
  galleryLayout: LAYOUTS.GRID,
  cubeImages: true,
  isVertical: true,
  groupSize: 1,
  hasThumbnails: false,
  groupTypes: '1',
  // this params were moved from the presets in layoutHelper and were not tested and checked yet.
  smartCrop: false,
  galleryType: 'Columns',
  fixedColumns: 0,
  targetItemSize: 0,
  enableScroll: true,
  cropOnlyFill: false,
  isSlider: false,
  isColumns: false,
  isGrid: true,
  isMasonry: false,
  isSlideshow: false,
  minItemSize: 50,
}

export const createStyles = styles => {
  return {
    ...styles,
    ...fixedStyles,
    targetItemSize: styles.targetItemSize || Math.round(styles.gallerySize * 8.5 + 150),
  }
}

