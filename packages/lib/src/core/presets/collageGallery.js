import LAYOUTS from '../../common/constants/layout';
import PLACEMENTS from '../../common/constants/placements';
import { calcTargetItemSize } from '../helpers/layoutHelper';

const fixToCollage = (styles) => {
  let presetStyles = { ...styles };
  presetStyles.galleryLayout = LAYOUTS.COLLAGE;
  presetStyles.cubeImages = false;
  presetStyles.titlePlacement = PLACEMENTS.SHOW_ON_HOVER;
  presetStyles.groupSize = 3;
  presetStyles.hasThumbnails = false;
  presetStyles.groupTypes = '1,2h,2v,3t,3b,3l,3r';
  presetStyles.slideshowLoop = false;

  // this params were moved from the presets in layoutHelper and were not tested and checked yet.
  presetStyles.targetItemSize = 0;
  presetStyles.fixedColumns = 0;
  presetStyles.enableScroll = true;
  presetStyles.isGrid = false;
  presetStyles.isSlider = false;
  presetStyles.isMasonry = false;
  presetStyles.isColumns = false;
  presetStyles.isSlideshow = false;
  presetStyles.cropOnlyFill = false;
  return presetStyles;
};
export const fixedStyles = fixToCollage({});

export const createStyles = (styles) => {
  let res = { ...styles };
  res = fixToCollage(res);
  res.targetItemSize = calcTargetItemSize(
    res,
    Math.round(res.gallerySize * 5 + 500)
  );
  return res;
};
