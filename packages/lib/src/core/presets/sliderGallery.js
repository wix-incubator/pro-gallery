import LAYOUTS from '../../common/constants/layout';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import { calcTargetItemSize } from '../helpers/layoutHelper';

const fixToSlider = (options) => {
  let presetOptions = { ...options };
  presetOptions.galleryLayout = LAYOUTS.SLIDER;
  presetOptions.enableInfiniteScroll = true;
  presetOptions.cubeImages = true;
  presetOptions.scrollDirection = SCROLL_DIRECTION.HORIZONTAL;
  presetOptions.isVertical = false;
  presetOptions.groupSize = 1;
  presetOptions.groupTypes = '1';

  // this params were moved from the presets in layoutHelper and were not tested and checked yet.
  presetOptions.smartCrop = false;
  presetOptions.galleryType = 'Strips';
  presetOptions.hasThumbnails = false;
  presetOptions.enableScroll = true;
  presetOptions.scrollSnap = true;
  presetOptions.isGrid = false;
  presetOptions.isSlider = true;
  presetOptions.isColumns = false;

  presetOptions.isSlideshow = false;
  presetOptions.cropOnlyFill = true;
  return presetOptions;
};
export const fixedOptions = fixToSlider({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToSlider(res);
  res.targetItemSize = calcTargetItemSize(res);
  return res;
};
