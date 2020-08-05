import LAYOUTS from '../../common/constants/layout';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import {calcTargetItemSize} from '../helpers/layoutHelper';

export const fixedStyles = {
  galleryLayout: LAYOUTS.PANORAMA,
  cubeImages: false,
  scrollDirection: SCROLL_DIRECTION.VERTICAL,
  isVertical: true,
  groupSize: 1,
  groupTypes: '1',
  // this params were moved from the presets in layoutHelper and were not tested and checked yet.

  galleryType: 'Columns',
  oneRow: false,
  fixedColumns: 1,
  enableScroll: true,
  isGrid: false,
  isColumns: false,
  isMasonry: false,
  isSlider: false,
  isSlideshow: false,
  cropOnlyFill: false,
  slideshowLoop: false,
}

export const createStyles = styles => {
  return {
    ...styles,
    ...fixedStyles,
    targetItemSize: calcTargetItemSize(styles),
  }
}
