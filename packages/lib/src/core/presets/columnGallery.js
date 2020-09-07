import LAYOUTS from '../../common/constants/layout';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import {calcTargetItemSize} from '../helpers/layoutHelper';

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
  slideshowLoop: false,
  
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
    targetItemSize: calcTargetItemSize(styles),
  }
}
