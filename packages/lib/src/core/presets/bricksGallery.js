import { calcTargetItemSize } from '../helpers/layoutHelper';
import optionsMap from '../helpers/optionsMap';
import { GALLERY_CONSTS } from '../..';

const fixToBricks = (options) => {
  let presetOptions = { ...options };
  presetOptions[optionsMap.layoutParams.structure.galleryLayout] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].BRICKS;
  presetOptions[optionsMap.layoutParams.crop.method] = GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FILL;
  presetOptions[optionsMap.layoutParams.crop.enable] = true;

  // presetOptions[optionsMap.layoutParams.crop.ratios] = [1]; replaced by the assignment of the rotating crop ratios that is now merged with this

  presetOptions[optionsMap.layoutParams.info.placement] =
    GALLERY_CONSTS[optionsMap.layoutParams.info.placement].OVERLAY;
  presetOptions[optionsMap.layoutParams.structure.scrollDirection] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL;
  presetOptions[optionsMap.layoutParams.structure.gallerySpacing] = 0;

  presetOptions[optionsMap.layoutParams.structure.layoutOrientation] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation].VERTICAL;
  presetOptions[optionsMap.layoutParams.groups.groupSize] = 3;
  presetOptions[optionsMap.layoutParams.groups.density] = 0.8;
  presetOptions[optionsMap.layoutParams.groups.allowedGroupTypes] = [
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['1'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['2h'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['2v'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3t'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3b'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3l'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3r'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3v'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3h'],
  ];
  presetOptions[optionsMap.behaviourParams.gallery.horizontal.loop] = false;
  presetOptions[optionsMap.layoutParams.structure.responsiveMode] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.responsiveMode].SET_ITEMS_PER_ROW;
  presetOptions[optionsMap.layoutParams.targetItemSize.value] = 400;
  presetOptions[optionsMap.layoutParams.targetItemSize.minimum] = 50;
  presetOptions[optionsMap.layoutParams.groups.groupByOrientation] = true;
  presetOptions[optionsMap.layoutParams.groups.repeatingGroupTypes] = [
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['2h'],
  ];
  presetOptions[optionsMap.layoutParams.crop.enableSmartCrop] = false;
  presetOptions[optionsMap.layoutParams.structure.scatter.randomScatter] = 0;

  presetOptions[optionsMap.layoutParams.structure.scatter.manualScatter] = '';
  presetOptions[optionsMap.layoutParams.structure.numberOfColumns] = 1;
  presetOptions[optionsMap.layoutParams.groups.numberOfGroupsPerRow] = 0;
  presetOptions[optionsMap.layoutParams.structure.groupsOrder] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.groupsOrder].BY_HEIGHT;
  presetOptions[optionsMap.layoutParams.crop.ratios] = [0.707, 1.414, 1.414, 0.707];
  //layouter direct API
  presetOptions.fixedColumns = 1;
  //layouter direct API
  return presetOptions;
};

export const fixedOptions = fixToBricks({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToBricks(res);
  res.targetItemSize = calcTargetItemSize(res);
  return res;
};
