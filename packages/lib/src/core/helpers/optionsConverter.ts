import { trimUndefinedValues_flat, flattenObject, flatToNested } from './optionsUtils.js';

import { isLayout } from '../../common/constants/layoutParams_structure_galleryLayout.js';
import optionsMap from './optionsMap.js';
import { addOldOptions } from './optionsBackwardConverter.js';
import {
  nameChangedLayoutParams,
  nameChangedBehaviourParams,
  nameChangedStylingParams,
  reversedLayoutParams,
  reversedBehaviourParams,
  changeNames,
  namingChange,
  reverseBooleans,
} from './migratorStore.js';

function extendNestedOptionsToIncludeOldAndNew(nestedOptions) {
  let flatOptions = flattenObject(nestedOptions);
  let populatedFlatOptions = addOldOptions(addMigratedOptions(flatOptions));
  return { ...flatToNested(populatedFlatOptions), ...populatedFlatOptions };
}

function addMigratedOptions(flatOptions) {
  const flat_migrated = migrateOptions(flatOptions);
  let flat_combinedOptions = {
    ...trimUndefinedValues_flat(flat_migrated),
    ...trimUndefinedValues_flat(flatOptions),
  };
  delete flat_combinedOptions.oldRefactoredOptionInCore;
  return flat_combinedOptions;
}

function migrateOptions(flatOptionsObject) {
  let migratedOptions = { ...flatOptionsObject };
  // let newStyles = flattenObject(cloneDeep(oldStyles));
  ///----------- LAYOUT -------------///
  migratedOptions = changeNames(migratedOptions, nameChangedLayoutParams);
  migratedOptions = reverseBooleans(migratedOptions, reversedLayoutParams);
  migratedOptions = process_old_to_new_ThumbnailAlignment(migratedOptions);
  migratedOptions = process_old_to_new_ScrollDirection(migratedOptions);
  migratedOptions = process_old_to_new_LayoutOrientation(migratedOptions);
  migratedOptions = process_old_to_new_groupsOrder(migratedOptions);
  migratedOptions = process_old_to_new_repeatingGroupTypes(migratedOptions);
  migratedOptions = process_old_to_new_AllowedGroupTypes(migratedOptions);
  migratedOptions = process_old_to_new_NumberOfColumns(migratedOptions); // fixedColumns || numberOfImagesPerRow
  migratedOptions = process_old_to_new_targetItemSizeUnit(migratedOptions);
  migratedOptions = process_old_to_new_targetItemSizeValue(migratedOptions);
  migratedOptions = process_old_to_new_CroppedAlignment(migratedOptions);
  migratedOptions = process_old_to_new_CropRatio(migratedOptions);
  migratedOptions = process_old_to_new_textBoxSizeMode(migratedOptions);
  migratedOptions = process_old_to_new_columnRatios(migratedOptions);
  migratedOptions = process_old_to_new_cropMethod(migratedOptions);
  migratedOptions = process_old_to_new_responsiveMode(migratedOptions);
  migratedOptions = process_old_to_new_gallerySpacing(migratedOptions);
  migratedOptions = process_old_to_new_slideshowInfoSize(migratedOptions);
  migratedOptions = process_old_to_new_arrowsPosition(migratedOptions);

  ///----------- BEHAVIOUR -------------///
  migratedOptions = changeNames(migratedOptions, nameChangedBehaviourParams);
  migratedOptions = reverseBooleans(migratedOptions, reversedBehaviourParams);
  migratedOptions = process_old_to_new_ClickAction(migratedOptions);
  migratedOptions = process_old_to_new_VideoPlayTrigger(migratedOptions);
  migratedOptions = process_old_to_new_VideoVolume(migratedOptions);
  migratedOptions = process_old_to_new_VideoSpeed(migratedOptions);
  migratedOptions = process_old_to_new_OverlayHoveringBehaviour(migratedOptions);
  migratedOptions = process_old_to_new_InfoPlacement(migratedOptions);
  migratedOptions = process_old_to_new_layoutDirection(migratedOptions);
  migratedOptions = process_old_to_new_LoadMoreAmount(migratedOptions);
  migratedOptions = process_old_to_new_AutoSlideBehaviour(migratedOptions);
  migratedOptions = process_old_to_new_galleryTextAlign(migratedOptions);

  ///----------- STYLING -------------///

  migratedOptions = changeNames(migratedOptions, nameChangedStylingParams);
  delete migratedOptions.fullscreen;
  return migratedOptions;
}

//----- refactor functions ----------//
function process_old_to_new_columnRatios(obj) {
  let _obj = obj;

  _obj = namingChange(_obj, 'columnWidths', optionsMap.layoutParams.structure.columnRatios);
  if (_obj[optionsMap.layoutParams.structure.columnRatios]?.length === 0) {
    _obj[optionsMap.layoutParams.structure.columnRatios] = [];
  } else {
    _obj[optionsMap.layoutParams.structure.columnRatios] = _obj[optionsMap.layoutParams.structure.columnRatios]
      ? _obj[optionsMap.layoutParams.structure.columnRatios]?.split
        ? [...(_obj[optionsMap.layoutParams.structure.columnRatios]?.split(',') || []).map(Number)]
        : _obj[optionsMap.layoutParams.structure.columnRatios]
      : undefined;
  }
  return _obj;
}

function process_old_to_new_targetItemSizeValue(obj) {
  let _obj = obj;
  let unit = _obj[optionsMap.layoutParams.targetItemSize.unit];
  let key;
  switch (unit) {
    case 'PIXEL':
      key = 'gallerySizePx';
      break;
    case 'SMART':
      key = 'gallerySize';
      break;
    case 'PERCENT':
      key = 'gallerySizeRatio';
      break;
  }
  _obj = namingChange(_obj, key, optionsMap.layoutParams.targetItemSize.value);

  delete _obj['gallerySizePx'];
  delete _obj['gallerySizeRatio'];
  delete _obj['gallerySize'];

  return _obj;
}
function process_old_to_new_cropMethod(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, 'cubeType', optionsMap.layoutParams.crop.method);
  _obj[optionsMap.layoutParams.crop.method] = _obj[optionsMap.layoutParams.crop.method]?.toUpperCase();
  return _obj;
}
function process_old_to_new_ThumbnailAlignment(obj) {
  //['galleryThumbnailsAlignment', optionsMap.layoutParams.thumbnails.alignment'],
  let _obj = obj;
  _obj = namingChange(_obj, 'galleryThumbnailsAlignment', optionsMap.layoutParams.thumbnails.alignment);
  _obj[optionsMap.layoutParams.thumbnails.alignment] =
    _obj[optionsMap.layoutParams.thumbnails.alignment]?.toUpperCase();
  return _obj;
}
function process_old_to_new_VideoPlayTrigger(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, 'videoPlay', optionsMap.behaviourParams.item.video.playTrigger);
  _obj[optionsMap.behaviourParams.item.video.playTrigger] =
    _obj[optionsMap.behaviourParams.item.video.playTrigger]?.toUpperCase();
  return _obj;
}
function process_old_to_new_targetItemSizeUnit(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, 'gallerySizeType', optionsMap.layoutParams.targetItemSize.unit);
  switch (_obj[optionsMap.layoutParams.targetItemSize.unit]) {
    case 'px':
      _obj[optionsMap.layoutParams.targetItemSize.unit] = 'PIXEL';
      break;
    case 'ratio':
      _obj[optionsMap.layoutParams.targetItemSize.unit] = 'PERCENT';
      break;
    case 'smart':
      _obj[optionsMap.layoutParams.targetItemSize.unit] = 'SMART';
      break;
  }
  return _obj;
}
function process_old_to_new_VideoVolume(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, 'videoSound', optionsMap.behaviourParams.item.video.volume);
  if (typeof _obj[optionsMap.behaviourParams.item.video.volume] !== 'undefined') {
    _obj[optionsMap.behaviourParams.item.video.volume] = Number(_obj[optionsMap.behaviourParams.item.video.volume]);
  }
  return _obj;
}
function process_old_to_new_VideoSpeed(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, 'videoSpeed', optionsMap.behaviourParams.item.video.speed);
  _obj[optionsMap.behaviourParams.item.video.speed] =
    Number(_obj[optionsMap.behaviourParams.item.video.speed]) >= 0
      ? Number(_obj[optionsMap.behaviourParams.item.video.speed])
      : undefined;
  return _obj;
}
function process_old_to_new_gallerySpacing(obj) {
  if (typeof obj[optionsMap.layoutParams.structure.gallerySpacing] !== 'undefined') {
    return obj;
  }
  let _obj = obj;
  let spacingVal;
  if (_obj['layoutParams_gallerySpacing'] >= 0) {
    spacingVal = _obj['layoutParams_gallerySpacing'];
  } else if (_obj['galleryMargin'] >= 0) {
    spacingVal = _obj['galleryMargin'];
  }
  _obj[optionsMap.layoutParams.structure.gallerySpacing] = spacingVal;
  delete _obj['layoutParams_gallerySpacing'];
  delete _obj['galleryMargin'];
  return _obj;
}
function process_old_to_new_arrowsPosition(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, 'arrowsPosition', optionsMap.layoutParams.navigationArrows.position);
  switch (_obj[optionsMap.layoutParams.navigationArrows.position]) {
    case 0:
      _obj[optionsMap.layoutParams.navigationArrows.position] = 'ON_GALLERY';
      break;
    case 1:
      _obj[optionsMap.layoutParams.navigationArrows.position] = 'OUTSIDE_GALLERY';
      break;
    case 2:
      _obj[optionsMap.layoutParams.navigationArrows.position] = 'MOUSE_CURSOR';
      break;
    default:
      break;
  }
  return _obj;
}
function process_old_to_new_responsiveMode(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, 'gridStyle', optionsMap.layoutParams.structure.responsiveMode);
  switch (_obj[optionsMap.layoutParams.structure.responsiveMode]) {
    case 0:
      _obj[optionsMap.layoutParams.structure.responsiveMode] = 'FIT_TO_SCREEN';
      break;
    case 1:
      _obj[optionsMap.layoutParams.structure.responsiveMode] = 'SET_ITEMS_PER_ROW';
      break;
    default:
      break;
  }
  return _obj;
}
function process_old_to_new_ScrollDirection(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, 'scrollDirection', optionsMap.layoutParams.structure.scrollDirection);
  switch (_obj[optionsMap.layoutParams.structure.scrollDirection]) {
    case 0:
      _obj[optionsMap.layoutParams.structure.scrollDirection] = 'VERTICAL';
      break;
    case 1:
      _obj[optionsMap.layoutParams.structure.scrollDirection] = 'HORIZONTAL';
      break;
    default:
      break;
  }
  return _obj;
}
function process_old_to_new_layoutDirection(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, 'isRTL', optionsMap.behaviourParams.gallery.layoutDirection);
  switch (_obj[optionsMap.behaviourParams.gallery.layoutDirection]) {
    case true:
      _obj[optionsMap.behaviourParams.gallery.layoutDirection] = 'RIGHT_TO_LEFT';
      break;
    case false:
      _obj[optionsMap.behaviourParams.gallery.layoutDirection] = 'LEFT_TO_RIGHT';
      break;
    default:
      break;
  }
  return _obj;
}
function process_old_to_new_slideshowInfoSize(obj) {
  let _obj = obj;
  const isSlideshow = isLayout('SLIDESHOW')({
    galleryLayout:
      obj['galleryLayout'] >= -3 ? obj['galleryLayout'] : obj[optionsMap.layoutParams.structure.galleryLayout],
  });
  if (isSlideshow) {
    _obj = namingChange(_obj, 'slideshowInfoSize', optionsMap.layoutParams.info.height);
  } else {
    _obj = namingChange(_obj, 'textBoxHeight', optionsMap.layoutParams.info.height);
  }
  delete _obj['slideshowInfoSize'];
  delete _obj['textBoxHeight'];
  return _obj;
}
function process_old_to_new_textBoxSizeMode(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, 'calculateTextBoxWidthMode', optionsMap.layoutParams.info.sizeUnits);
  switch (_obj[optionsMap.layoutParams.info.sizeUnits]) {
    case 'PERCENT':
      _obj[optionsMap.layoutParams.info.sizeUnits] = 'PERCENT';
      _obj = namingChange(_obj, 'textBoxWidthPercent', optionsMap.layoutParams.info.width);
      delete _obj['textBoxWidth'];
      break;
    case 'MANUAL':
      _obj[optionsMap.layoutParams.info.sizeUnits] = 'PIXEL';
      _obj = namingChange(_obj, 'textBoxWidth', optionsMap.layoutParams.info.width);
      delete _obj['textBoxWidthPercent'];
      break;
    default:
      break;
  }
  return _obj;
}
function process_old_to_new_LayoutOrientation(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, 'isVertical', optionsMap.layoutParams.structure.layoutOrientation);
  switch (_obj[optionsMap.layoutParams.structure.layoutOrientation]) {
    case true:
      _obj[optionsMap.layoutParams.structure.layoutOrientation] = 'VERTICAL';
      break;
    case false:
      _obj[optionsMap.layoutParams.structure.layoutOrientation] = 'HORIZONTAL';
      break;
    default:
      break;
  }
  return _obj;
}
function process_old_to_new_groupsOrder(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, 'placeGroupsLtr', optionsMap.layoutParams.structure.groupsOrder);
  switch (_obj[optionsMap.layoutParams.structure.groupsOrder]) {
    case true:
      _obj[optionsMap.layoutParams.structure.groupsOrder] = 'LEFT_TO_RIGHT';
      break;
    case false:
      _obj[optionsMap.layoutParams.structure.groupsOrder] = 'BY_HEIGHT';
      break;
    default:
      break;
  }
  // 'RIGHT_TO_LEFT' doesnt exist yet.
  return _obj;
}
function process_old_to_new_galleryTextAlign(obj) {
  let _obj = obj;
  _obj = namingChange(
    _obj,
    'galleryTextAlign',
    optionsMap.behaviourParams.gallery.horizontal.slideshowInfo.buttonsAlignment
  );
  _obj[optionsMap.behaviourParams.gallery.horizontal.slideshowInfo.buttonsAlignment] =
    _obj[optionsMap.behaviourParams.gallery.horizontal.slideshowInfo.buttonsAlignment]?.toUpperCase();
  return _obj;
}
function process_old_to_new_LoadMoreAmount(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, 'loadMoreAmount', optionsMap.behaviourParams.gallery.vertical.loadMore.amount);
  _obj[optionsMap.behaviourParams.gallery.vertical.loadMore.amount] =
    _obj[optionsMap.behaviourParams.gallery.vertical.loadMore.amount]?.toUpperCase();
  return _obj;
}
function process_old_to_new_CroppedAlignment(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, 'cubeFitPosition', optionsMap.layoutParams.crop.alignment);
  switch (_obj[optionsMap.layoutParams.crop.alignment]) {
    case 'MIDDLE':
      _obj[optionsMap.layoutParams.crop.alignment] = 'CENTER';
      break;
    default:
      break;
  }
  return _obj;
}
function process_old_to_new_OverlayHoveringBehaviour(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, 'hoveringBehaviour', optionsMap.behaviourParams.item.overlay.hoveringBehaviour);
  switch (_obj[optionsMap.behaviourParams.item.overlay.hoveringBehaviour]) {
    case 'NO_CHANGE':
      _obj[optionsMap.behaviourParams.item.overlay.hoveringBehaviour] = 'ALWAYS_SHOW';
      break;
    case 'NEVER_SHOW':
      _obj[optionsMap.behaviourParams.item.overlay.hoveringBehaviour] = 'NEVER_SHOW';
      break;
    default:
      break;
  }
  return _obj;
}
function process_old_to_new_InfoPlacement(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, 'titlePlacement', optionsMap.layoutParams.info.placement);
  switch (_obj[optionsMap.layoutParams.info.placement]) {
    case 'SHOW_ON_HOVER':
      _obj[optionsMap.layoutParams.info.placement] = 'OVERLAY';
      break;
    case 'SHOW_BELOW':
      _obj[optionsMap.layoutParams.info.placement] = 'BELOW';
      break;
    case 'SHOW_ABOVE':
      _obj[optionsMap.layoutParams.info.placement] = 'ABOVE';
      break;
    case 'SHOW_ON_THE_RIGHT':
      _obj[optionsMap.layoutParams.info.placement] = 'RIGHT';
      break;
    case 'SHOW_ON_THE_LEFT':
      _obj[optionsMap.layoutParams.info.placement] = 'LEFT';
      break;
    case 'ALTERNATE_HORIZONTAL':
      _obj[optionsMap.layoutParams.info.placement] = 'ALTERNATE_HORIZONTALLY';
      break;
    case 'ALTERNATE_VERTICAL':
      _obj[optionsMap.layoutParams.info.placement] = 'ALTERNATE_VERTICALLY';
      break;
    default:
      break;
  }
  return _obj;
}
function process_old_to_new_ClickAction(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, 'itemClick', optionsMap.behaviourParams.item.clickAction);
  _obj[optionsMap.behaviourParams.item.clickAction] = _obj[optionsMap.behaviourParams.item.clickAction]?.toUpperCase();
  switch (_obj[optionsMap.behaviourParams.item.clickAction]) {
    case 'FULLSCREEN':
    case 'EXPAND':
      _obj[optionsMap.behaviourParams.item.clickAction] = 'ACTION';
      break;
    default:
      break;
  }
  return _obj;
}
function process_old_to_new_AutoSlideBehaviour(obj) {
  if (typeof obj[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour] !== 'undefined') {
    return obj;
  }
  let _obj = obj;
  let isAutoSlide = _obj['isAutoSlideshow'];
  let autoSlideshowType = _obj['autoSlideshowType'];
  let finalVal;
  if (typeof isAutoSlide === 'undefined') {
    finalVal = undefined;
  } else {
    if (!isAutoSlide) {
      finalVal = 'OFF';
    } else {
      if (autoSlideshowType === 'interval') {
        finalVal = 'INTERVAL';
      } else {
        finalVal = 'CONTINUOUS';
      }
    }
  }
  _obj[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour] = finalVal;
  delete _obj['isAutoSlideshow'];
  delete _obj['autoSlideshowType'];
  return _obj;
}
function process_old_to_new_CropRatio(obj) {
  if (typeof obj[optionsMap.layoutParams.crop.ratios] !== 'undefined') {
    return obj;
  }
  let _obj = obj;
  let repeatingVal = _obj['rotatingCropRatios'];
  let val = _obj['cubeRatio'] || _obj['layoutParams_cropRatio'];
  let finalVal;
  if (typeof repeatingVal === 'string' && repeatingVal !== '') {
    finalVal = repeatingVal;
  } else {
    finalVal = val;
  }
  const getVal = (ele) => {
    if (Number(ele) >= 0) {
      return Number(ele);
    } else {
      return ele;
    }
  };
  _obj[optionsMap.layoutParams.crop.ratios] = finalVal && String(finalVal).split(',').map(getVal);
  delete _obj['cubeRatio'];
  delete _obj['layoutParams_cropRatio'];
  delete _obj['rotatingCropRatios'];
  return _obj;
}
function process_old_to_new_AllowedGroupTypes(obj) {
  if (typeof obj[optionsMap.layoutParams.groups.allowedGroupTypes] !== 'undefined') {
    return obj;
  }
  let _obj = obj;

  _obj[optionsMap.layoutParams.groups.allowedGroupTypes] = _obj['groupTypes']?.split
    ? _obj['groupTypes'].split(',')
    : _obj['groupTypes']
    ? _obj['groupTypes']
    : undefined;
  delete _obj['groupTypes'];
  return _obj;
}
function process_old_to_new_repeatingGroupTypes(obj) {
  if (typeof obj[optionsMap.layoutParams.groups.repeatingGroupTypes] !== 'undefined') {
    return obj;
  }
  let _obj = obj;
  let repeatingVal = _obj['rotatingGroupTypes'] || _obj['layoutParams_repeatingGroupTypes'];
  let finalVal;
  if (typeof repeatingVal === 'string' && repeatingVal !== '') {
    finalVal = repeatingVal.split(',');
  } else if (typeof repeatingVal === 'string' && repeatingVal === '') {
    finalVal = [];
  } else {
    finalVal = undefined;
  }
  _obj[optionsMap.layoutParams.groups.repeatingGroupTypes] = finalVal;
  delete _obj['layoutParams_repeatingGroupTypes'];
  delete _obj['rotatingGroupTypes'];
  return _obj;
}
function process_old_to_new_NumberOfColumns(obj) {
  if (typeof obj[optionsMap.layoutParams.structure.numberOfColumns] !== 'undefined') {
    return obj;
  }
  let _obj = obj;
  const numberOfImagesPerRow = obj['numberOfImagesPerRow'];
  const finalVal = numberOfImagesPerRow >= 0 ? numberOfImagesPerRow : undefined;

  _obj[optionsMap.layoutParams.structure.numberOfColumns] = finalVal;
  delete _obj['numberOfImagesPerRow'];
  return _obj;
}

export { migrateOptions, addMigratedOptions, extendNestedOptionsToIncludeOldAndNew };
