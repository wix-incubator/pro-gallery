import LAYOUTS from '../../common/constants/layout';
// import INFO_BEHAVIOUR_ON_HOVER from '../../common/constants/infoBehaviourOnHover';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import {
  calcTargetItemSize,
  removeBordersIfNeeded,
} from '../helpers/layoutHelper';
import { assignByString } from '../helpers/optionsUtils';
import disableAnimationsForSlideshowLayouts from './disableAnimationsForSlideshowLayouts';

const fixToShowcase = (options) => {
  let presetOptions = { ...options };
  console.error(
    'This is an experimental preset of the gallery(WIP). avoid using this in production'
  );
  // presetOptions.hoveringBehaviour = INFO_BEHAVIOUR_ON_HOVER.NEVER_SHOW;
  // presetOptions.titlePlacement = 'SHOW_BELOW';
  // presetOptions.hasThumbnails = true;

  presetOptions.galleryLayout = LAYOUTS.EXPERIMENTAL_SHOWCASE;
  presetOptions.scrollDirection = SCROLL_DIRECTION.HORIZONTAL;

  presetOptions.itemBorderWidth = 0;
  presetOptions.itemBorderRadius = 0;
  presetOptions.itemBorderColor = undefined;

  presetOptions = assignByString(
    presetOptions,
    'layoutParams_cropRatio',
    '100%/100%'
  );
  presetOptions.cubeImages = true;
  presetOptions = assignByString(
    presetOptions,
    'layoutParams_gallerySpacing',
    0
  );
  presetOptions.isVertical = false;
  presetOptions.groupSize = 1;
  presetOptions.groupTypes = '1';
  presetOptions.numberOfImagesPerCol = 1;
  presetOptions.imageMargin = 0;

  disableAnimationsForSlideshowLayouts(presetOptions);

  presetOptions.smartCrop = false;
  presetOptions.targetItemSize = 550;
  presetOptions.galleryType = 'Strips';
  presetOptions.fixedColumns = 1;
  presetOptions.enableScroll = true;
  presetOptions.scrollSnap = true;
  presetOptions.cropOnlyFill = false;
  presetOptions.scatter = 0;
  presetOptions.rotatingScatter = '';
  return presetOptions;
};
export const fixedOptions = fixToShowcase({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToShowcase(res);
  res.targetItemSize = calcTargetItemSize(res);
  res = removeBordersIfNeeded(res);
  return res;
};
