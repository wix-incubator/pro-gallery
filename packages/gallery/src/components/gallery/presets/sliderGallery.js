import LAYOUTS from '../../../common/constants/layout';
import SCROLL_DIRECTION from '../../../common/constants/scrollDirection';

export const fixedStyles = {
  //tested params
  galleryLayout: LAYOUTS.SLIDER,
  enableInfiniteScroll: true,
  cubeImages: true,
  oneRow: true,
  scrollDirection: SCROLL_DIRECTION.HORIZONTAL,
  isVertical: false,
  groupSize: 1,
  groupTypes: '1',
  
  //this params were moved from the presets in layoutHelper and were not tested and checked yet.
  smartCrop: false,
  galleryType: 'Strips',
  hasThumbnails: false,
  enableScroll: true,
  scrollSnap: true,
  isGrid: false,
  isSlider: true,
  isColumns: false,
  isMasonry: false,
  isSlideshow: false,
  cropOnlyFill: true,

}

export const createStyles = styles => {
  return {
    ...styles,
    ...fixedStyles,
  }
}

