import LAYOUTS from '../../common/constants/layout';
import INFO_BEHAVIOUR_ON_HOVER from '../../common/constants/infoBehaviourOnHover';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import { calcTargetItemSize } from '../helpers/layoutHelper';
import { assignByString } from '../helpers/optionsUtils';

const fixToSlideshow = (options) => {
  let presetOptions = { ...options };
  presetOptions.galleryLayout = LAYOUTS.SLIDESHOW;
  presetOptions.enableInfiniteScroll = true;
  presetOptions = assignByString(
    presetOptions,
    'layoutParams_cropRatio',
    '100%/100%'
  );
  presetOptions.cubeImages = true;
  presetOptions.hoveringBehaviour = INFO_BEHAVIOUR_ON_HOVER.NEVER_SHOW;
  presetOptions.scrollDirection = SCROLL_DIRECTION.HORIZONTAL;
  presetOptions = assignByString(
    presetOptions,
    'layoutParams_gallerySpacing',
    0
  );
  presetOptions.isVertical = false;
  presetOptions.groupSize = 1;
  presetOptions.groupTypes = '1';
  presetOptions.itemBorderWidth = 0;
  presetOptions.itemBorderRadius = 0;
  presetOptions.itemBorderColor = undefined;
  presetOptions.numberOfImagesPerCol = 1;

  // this params were moved from the presets in layoutHelper and were not tested and checked yet.
  presetOptions.smartCrop = false;
  presetOptions.targetItemSize = 550;
  presetOptions.galleryType = 'Strips';
  presetOptions.fixedColumns = 1;
  presetOptions.hasThumbnails = false;
  presetOptions.enableScroll = true;
  presetOptions.scrollSnap = true;
  presetOptions.isGrid = false;
  presetOptions.isColumns = false;

  presetOptions.isSlider = false;
  presetOptions.isSlideshow = true;
  presetOptions.cropOnlyFill = false;
  presetOptions.scatter = 0;
  presetOptions.rotatingScatter = '';
  presetOptions.imageMargin = 0;
  return presetOptions;
};
export const fixedOptions = fixToSlideshow({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToSlideshow(res);
  res.targetItemSize = calcTargetItemSize(res);
  return res;
};
