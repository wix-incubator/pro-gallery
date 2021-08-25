import LAYOUTS from '../../common/constants/layout';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import { featureManager } from '../helpers/versionsHelper';
import { assignByString } from '../helpers/optionsUtils';

const fixToMagic = (styles) => {
  let presetStyles = { ...styles };
  presetStyles.galleryLayout = LAYOUTS.MAGIC;
  presetStyles.cubeImages = undefined;
  presetStyles = assignByString(
    presetStyles,
    'layoutParams_cropRatio',
    undefined
  );
  presetStyles.isVertical = undefined;
  presetStyles.targetItemSize = undefined;
  presetStyles.collageAmount = undefined;
  presetStyles.collageDensity = undefined;
  presetStyles.groupTypes = undefined;
  presetStyles.oneRow = undefined; // later on in layoutHelper this can be changed if it is false, so not exactly fixed;
  presetStyles.imageMargin = undefined;
  presetStyles.scatter = undefined;
  presetStyles = assignByString(
    presetStyles,
    'layoutParams_gallerySpacing',
    undefined
  );
  presetStyles.chooseBestGroup = undefined;
  presetStyles.smartCrop = undefined;
  presetStyles.cubeType = undefined;
  presetStyles.hasThumbnails = undefined;
  presetStyles.enableScroll = undefined;
  presetStyles.isGrid = undefined;
  presetStyles.isSlideshow = undefined;
  presetStyles.isSlider = undefined;
  presetStyles.isColumns = undefined;
  presetStyles.cropOnlyFill = undefined;
  presetStyles.fixedColumns = undefined;
  presetStyles.enableInfiniteScroll = undefined;
  presetStyles.slideshowLoop = false;
  return presetStyles;
};
export const fixedStyles = fixToMagic({});

const addSeedStyles = (styles) => {
  let res = { ...styles };
  let seed = res.magicLayoutSeed;
  if (!seed > 0) {
    seed = 999999;
  }
  seed = Math.floor(seed);

  const strToSeed = (str) => {
    str = String(str);
    let total = 0;
    for (let s = 0; s < str.length; s++) {
      total += str.charCodeAt(s);
    }
    return total;
  };

  const mergeSeeds = (s1, s2) => {
    return Math.floor((s1 / s2 - Math.floor(s1 / s2)) * 10000000);
  };

  const numFromSeed = (min, max, strSeed) => {
    const seed2 = strToSeed(strSeed);
    const range = max - min + 1;
    return (mergeSeeds(seed, seed2) % range) + min;
  };

  const boolFromSeed = (strSeed) => {
    return !!numFromSeed(0, 1, strSeed);
  };

  res.cubeImages = boolFromSeed('cubeImages');
  res = assignByString(
    res,
    'layoutParams_cropRatio',
    numFromSeed(1, 25, 'cubeRatio') / 5
  );
  res.isVertical = boolFromSeed('isVertical');
  res.targetItemSize = numFromSeed(300, 800, 'gallerySize');
  res.collageAmount = numFromSeed(5, 10, 'collageAmount') / 10;
  res.collageDensity =
    (featureManager.supports.spacingCalculation
      ? numFromSeed(1, 100, 'collageDensity')
      : numFromSeed(5, 10, 'collageDensity')) / 100;
  res.groupTypes = ['1'].concat(
    '2h,2v,3t,3b,3l,3r,3h,3v'
      .split(',')
      .filter((type, i) => boolFromSeed('groupTypes' + i))
  );
  res.oneRow = boolFromSeed('oneRow'); //we keep oneRow here as this is the string that defines the outcome of the seed.
  res.imageMargin = numFromSeed(
    0,
    featureManager.supports.spacingCalculation
      ? numFromSeed(300, 800, 'gallerySize') / 5
      : 5,
    'imageMargin'
  );
  res = assignByString(
    res,
    'layoutParams_gallerySpacing',
    featureManager.supports.spacingCalculation
      ? 0
      : numFromSeed(0, 5, 'imageMargin')
  );
  res.scatter = 0;
  res.rotatingScatter = '';
  res.chooseBestGroup = boolFromSeed('chooseBestGroup');
  res.smartCrop = boolFromSeed('smartCrop');
  res.cubeType = 'fill';
  res.enableScroll = true;
  res.isGrid = false;
  res.isSlideshow = false;
  res.isSlider = false;
  res.isColumns = false;
  res.cropOnlyFill = false;
  res.fixedColumns = 0;
  res.enableInfiniteScroll = 1;

  //force adjustments
  if (res.oneRow) {
    res.isVertical = false;
    res.scrollDirection = SCROLL_DIRECTION.HORIZONTAL;
  } else {
    res.scrollDirection = SCROLL_DIRECTION.VERTICAL;
  }
  res.galleryType = res.isVertical ? 'Columns' : 'Strips';
  res.groupSize = parseInt(res.groupTypes.slice(-1)[0]);
  res.groupTypes = res.groupTypes.join(',');
  res.minItemSize = res.targetItemSize / res.groupSize / 2;

  return res;
};

export const createStyles = (styles) => {
  let res = { ...styles };
  res = fixToMagic(res);
  res = addSeedStyles(res);
  return res;
};
