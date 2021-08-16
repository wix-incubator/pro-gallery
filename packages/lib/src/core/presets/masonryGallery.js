import LAYOUTS from '../../common/constants/layout';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import {
  calcTargetItemSize,
  processNumberOfImagesPerRow,
} from '../helpers/layoutHelper';
import { featureManager } from '../helpers/versionsHelper';

const fixToMasonry = (styles) => {
  let presetStyles = { ...styles };
  presetStyles.galleryLayout = LAYOUTS.MASONRY;
  presetStyles.cubeImages = false;
  presetStyles.scrollDirection = SCROLL_DIRECTION.VERTICAL;
  presetStyles.groupSize = 1;
  presetStyles.groupTypes = '1';
  presetStyles.slideshowLoop = false;

  // this params were moved from the presets in layoutHelper and were not tested and checked yet.
  presetStyles.fixedColumns = 0;
  presetStyles.enableScroll = true;
  presetStyles.isGrid = false;
  presetStyles.isSlider = false;
  presetStyles.isMasonry = true;
  presetStyles.isColumns = false;
  presetStyles.isSlideshow = false;
  presetStyles.cropOnlyFill = false;
  return presetStyles;
};
export const fixedStyles = fixToMasonry({});

export const createStyles = (styles) => {
  let res = { ...styles };
  res = fixToMasonry(res);
  res.targetItemSize = calcTargetItemSize(
    res,
    res.isVertical ? res.gallerySize * 8 + 200 : res.gallerySize * 5 + 200
  );
  if (featureManager.supports.fixedColumnsInMasonry) {
    res = processNumberOfImagesPerRow(res);
  }
  return res;
};
