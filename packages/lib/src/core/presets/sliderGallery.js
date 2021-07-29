import LAYOUTS from '../../common/constants/layout';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import { calcTargetItemSize } from '../helpers/layoutHelper';

const fixToSlider = (styles) => {
  let presetStyles = { ...styles };
  presetStyles.galleryLayout = LAYOUTS.SLIDER;
  presetStyles.enableInfiniteScroll = true;
  presetStyles.cubeImages = true;
  presetStyles.scrollDirection = SCROLL_DIRECTION.HORIZONTAL;
  presetStyles.isVertical = false;
  presetStyles.groupSize = 1;
  presetStyles.groupTypes = '1';

  // this params were moved from the presets in layoutHelper and were not tested and checked yet.
  presetStyles.smartCrop = false;
  presetStyles.galleryType = 'Strips';
  presetStyles.hasThumbnails = false;
  presetStyles.enableScroll = true;
  presetStyles.scrollSnap = true;
  presetStyles.isGrid = false;
  presetStyles.isSlider = true;
  presetStyles.isColumns = false;
  presetStyles.isMasonry = false;
  presetStyles.isSlideshow = false;
  presetStyles.cropOnlyFill = true;
  return presetStyles;
};
export const fixedStyles = fixToSlider({});

export const createStyles = (styles) => {
  let res = { ...styles };
  res = fixToSlider(res);
  res.targetItemSize = calcTargetItemSize(res);
  return res;
};
