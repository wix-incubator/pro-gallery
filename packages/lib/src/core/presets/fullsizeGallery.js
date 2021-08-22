import LAYOUTS from '../../common/constants/layout';
import PLACEMENTS from '../../common/constants/placements';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import { calcTargetItemSize } from '../helpers/layoutHelper';
import { assignByString } from '../helpers/stylesUtils';

const fixToFullsize = (styles) => {
  let presetStyles = { ...styles };
  presetStyles.galleryLayout = LAYOUTS.FULLSIZE;
  presetStyles.cubeImages = true;
  presetStyles = assignByString(
    presetStyles,
    'layoutParams_cropRatio',
    '100%/100%'
  );
  presetStyles.cubeType = 'fill';
  presetStyles.titlePlacement = PLACEMENTS.SHOW_ON_HOVER;
  presetStyles.scrollDirection = SCROLL_DIRECTION.HORIZONTAL;
  presetStyles.galleryMargin = 0;
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
  presetStyles.isSlider = false;
  presetStyles.isColumns = false;
  presetStyles.isMasonry = false;
  presetStyles.isSlideshow = false;
  presetStyles.cropOnlyFill = false;
  presetStyles.scatter = 0;
  presetStyles.rotatingScatter = '';
  presetStyles = assignByString(presetStyles, 'layoutParams_itemSpacing', 0);
  return presetStyles;
};
export const fixedStyles = fixToFullsize({});

export const createStyles = (styles) => {
  let res = { ...styles };
  res = fixToFullsize(res);
  res.targetItemSize = calcTargetItemSize(res);
  return res;
};
