import LAYOUTS from '../../common/constants/layout';
import INFO_BEHAVIOUR_ON_HOVER from '../../common/constants/infoBehaviourOnHover';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import ARROWS_VERTICAL_POSITION from '../../common/constants/arrowsVerticalPosition';
import { calcTargetItemSize } from '../helpers/layoutHelper';
import { assignByString } from '../helpers/optionsUtils';

const fixToSlideshow = (styles) => {
  let presetStyles = { ...styles };
  presetStyles.galleryLayout = LAYOUTS.SLIDESHOW;
  presetStyles.enableInfiniteScroll = true;
  presetStyles = assignByString(
    presetStyles,
    'layoutParams_cropRatio',
    '100%/100%'
  );
  presetStyles.cubeImages = true;
  presetStyles.hoveringBehaviour = INFO_BEHAVIOUR_ON_HOVER.NEVER_SHOW;
  presetStyles.scrollDirection = SCROLL_DIRECTION.HORIZONTAL;
  presetStyles = assignByString(presetStyles, 'layoutParams_gallerySpacing', 0);
  presetStyles.isVertical = false;
  presetStyles.groupSize = 1;
  presetStyles.groupTypes = '1';
  presetStyles.arrowsVerticalPosition = ARROWS_VERTICAL_POSITION.IMAGE_CENTER;
  presetStyles.itemBorderWidth = 0;
  presetStyles.itemBorderRadius = 0;
  presetStyles.itemBorderColor = undefined;

  // this params were moved from the presets in layoutHelper and were not tested and checked yet.
  presetStyles.smartCrop = false;
  presetStyles.targetItemSize = 550;
  presetStyles.galleryType = 'Strips';
  presetStyles.fixedColumns = 1;
  presetStyles.hasThumbnails = false;
  presetStyles.enableScroll = true;
  presetStyles.scrollSnap = true;
  presetStyles.isGrid = false;
  presetStyles.isColumns = false;
  presetStyles.isMasonry = false;
  presetStyles.isSlider = false;
  presetStyles.isSlideshow = true;
  presetStyles.cropOnlyFill = false;
  presetStyles.scatter = 0;
  presetStyles.rotatingScatter = '';
  presetStyles.imageMargin = 0;
  return presetStyles;
};
export const fixedStyles = fixToSlideshow({});

export const createStyles = (styles) => {
  let res = { ...styles };
  res = fixToSlideshow(res);
  res.targetItemSize = calcTargetItemSize(res);
  return res;
};
