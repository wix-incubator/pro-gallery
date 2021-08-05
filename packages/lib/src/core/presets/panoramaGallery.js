import LAYOUTS from '../../common/constants/layout';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import { calcTargetItemSize } from '../helpers/layoutHelper';

const fixToPanorama = (styles) => {
  let presetStyles = { ...styles };
  presetStyles.galleryLayout = LAYOUTS.PANORAMA;
  presetStyles.cubeImages = false;
  presetStyles.scrollDirection = SCROLL_DIRECTION.VERTICAL;
  presetStyles.isVertical = true;
  presetStyles.groupSize = 1;
  presetStyles.groupTypes = '1';
  // this params were moved from the presets in layoutHelper and were not tested and checked yet.

  presetStyles.galleryType = 'Columns';
  presetStyles.fixedColumns = 1;
  presetStyles.enableScroll = true;
  presetStyles.isGrid = false;
  presetStyles.isColumns = false;
  presetStyles.isMasonry = false;
  presetStyles.isSlider = false;
  presetStyles.isSlideshow = false;
  presetStyles.cropOnlyFill = false;
  presetStyles.slideshowLoop = false;
  return presetStyles;
};
export const fixedStyles = fixToPanorama({});

export const createStyles = (styles) => {
  let res = { ...styles };
  res = fixToPanorama(res);
  res.targetItemSize = calcTargetItemSize(res);
  return res;
};
