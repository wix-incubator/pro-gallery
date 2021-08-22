import LAYOUTS from '../../common/constants/layout';
import PLACEMENTS from '../../common/constants/placements';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import { calcTargetItemSize } from '../helpers/layoutHelper';
import { assignByString } from '../helpers/stylesUtils';

const fixToThumbnail = (styles) => {
  let presetStyles = { ...styles };
  presetStyles.galleryLayout = LAYOUTS.THUMBNAIL;
  presetStyles.enableInfiniteScroll = true;
  presetStyles = assignByString(
    presetStyles,
    'layoutParams_cropRatio',
    '100%/100%'
  );
  presetStyles.cubeImages = true;
  presetStyles.titlePlacement = PLACEMENTS.SHOW_ON_HOVER;
  presetStyles.scrollDirection = SCROLL_DIRECTION.HORIZONTAL;
  presetStyles = assignByString(presetStyles, 'layoutParams_gallerySpacing', 0);
  presetStyles.isVertical = false;
  presetStyles.groupSize = 1;
  presetStyles.groupTypes = '1';

  // this params were moved from the presets in layoutHelper and were not tested and checked yet.
  presetStyles.smartCrop = false;
  presetStyles.galleryType = 'Strips';
  presetStyles.hasThumbnails = true;
  presetStyles.enableScroll = true;
  presetStyles.scrollSnap = true;
  presetStyles.isGrid = false;
  presetStyles.isSlider = false;
  presetStyles.isMasonry = false;
  presetStyles.isColumns = false;
  presetStyles.isSlideshow = false;
  presetStyles.cropOnlyFill = false;
  presetStyles.scatter = 0;
  presetStyles.rotatingScatter = '';
  presetStyles = assignByString(presetStyles, 'layoutParams_itemSpacing', 0);
  return presetStyles;
};
export const fixedStyles = fixToThumbnail({});

export const createStyles = (styles) => {
  let res = { ...styles };
  res = fixToThumbnail(res);
  res.targetItemSize = calcTargetItemSize(res);
  return res;
};
