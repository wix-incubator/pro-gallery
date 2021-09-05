import LAYOUTS from '../../common/constants/layout';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import { calcTargetItemSize } from '../helpers/layoutHelper';

const fixToPanorama = (options) => {
  let presetOptions = { ...options };
  presetOptions.galleryLayout = LAYOUTS.PANORAMA;
  presetOptions.cubeImages = false;
  presetOptions.scrollDirection = SCROLL_DIRECTION.VERTICAL;
  presetOptions.isVertical = true;
  presetOptions.groupSize = 1;
  presetOptions.groupTypes = '1';
  // this params were moved from the presets in layoutHelper and were not tested and checked yet.

  presetOptions.galleryType = 'Columns';
  presetOptions.fixedColumns = 1;
  presetOptions.enableScroll = true;
  presetOptions.isGrid = false;
  presetOptions.isColumns = false;

  presetOptions.isSlider = false;
  presetOptions.isSlideshow = false;
  presetOptions.cropOnlyFill = false;
  presetOptions.slideshowLoop = false;
  return presetOptions;
};
export const fixedOptions = fixToPanorama({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToPanorama(res);
  res.targetItemSize = calcTargetItemSize(res);
  return res;
};
