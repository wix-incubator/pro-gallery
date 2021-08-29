import { assignByString, mergeNestedObjects } from './optionsUtils';
import optionsMap from './optionsMap';
import {
  nameChangedLayoutParams,
  nameChangedBehaviourParams,
  nameChangedStylingParams,
  reversedLayoutParams,
  reversedBehaviourParams,
  layoutParamsMap,
  behaviourParams,
  stylingParams,
  changeNames,
  namingChange,
  reverseBooleans,
} from './migratorStore';
function convertOptions(initialOptions) {
  //This will add the new names while keeping the old ones.
  let options = { ...initialOptions };
  Object.keys(initialOptions).forEach((key) => {
    options[layoutParamsMap[key]] = initialOptions[key];
  });
  Object.keys(initialOptions).forEach((key) => {
    options[behaviourParams[key]] = initialOptions[key];
  });
  Object.keys(initialOptions).forEach((key) => {
    options[stylingParams[key]] = initialOptions[key];
  });
  return options;
}

function convertOptionsBackwards(initialOptions) {
  //This will add the old names while keeping the new ones.
  let options = { ...initialOptions };
  Object.keys(layoutParamsMap).forEach((key) => {
    if (typeof initialOptions[layoutParamsMap[key]] !== 'undefined') {
      options[key] = initialOptions[layoutParamsMap[key]];
    }
  });
  Object.keys(behaviourParams).forEach((key) => {
    if (typeof initialOptions[behaviourParams[key]] !== 'undefined') {
      options[key] = initialOptions[behaviourParams[key]];
    }
  });
  Object.keys(stylingParams).forEach((key) => {
    if (typeof initialOptions[stylingParams[key]] !== 'undefined') {
      options[key] = initialOptions[stylingParams[key]];
    }
  });
  return options;
}

function addMigratedOptions(options) {
  let migrated = migrateOptions(options);
  let combinedOptions = mergeNestedObjects(migrated, options);
  delete combinedOptions.oldRefactoredOptionInCore;
  return combinedOptions;
}

function migrateOptions(oldStyles) {
  let newStyles = { ...oldStyles };

  ///----------- LAYOUT -------------///
  newStyles = changeNames(newStyles, nameChangedLayoutParams);
  newStyles = reverseBooleans(newStyles, reversedLayoutParams);
  newStyles = process_old_to_new_ThumbnailAlignment(newStyles);
  newStyles = process_old_to_new_ScrollDirection(newStyles);
  newStyles = process_old_to_new_LayoutOrientation(newStyles);
  newStyles = process_old_to_new_ForceGroupsOrder(newStyles);
  newStyles = process_old_to_new_GroupTypes(newStyles);
  newStyles = process_old_to_new_NumberOfColumns(newStyles); // fixedColumns || numberOfImagesPerRow || numberOfGroupsPerRow (notice its losing if its 0)
  newStyles = process_old_to_new_targetItemSizeUnit(newStyles);
  newStyles = process_old_to_new_targetItemSizeValue(newStyles);
  newStyles = process_old_to_new_CroppedAlignment(newStyles);
  newStyles = process_old_to_new_CropRatio(newStyles);
  newStyles = process_old_to_new_textBoxSizeMode(newStyles);
  newStyles = process_old_to_new_columnRatios(newStyles);

  ///----------- BEHAVIOUR -------------///
  newStyles = changeNames(newStyles, nameChangedBehaviourParams);
  newStyles = reverseBooleans(newStyles, reversedBehaviourParams);
  newStyles = process_old_to_new_ClickAction(newStyles);
  newStyles = process_old_to_new_VideoPlayTrigger(newStyles);
  newStyles = process_old_to_new_VideoVolume(newStyles);
  newStyles = process_old_to_new_VideoSpeed(newStyles);
  newStyles = process_old_to_new_OverlayHoveringBehaviour(newStyles);
  newStyles = process_old_to_new_InfoPlacement(newStyles);
  newStyles = process_old_to_new_layoutDirection(newStyles);
  newStyles = process_old_to_new_LoadMoreAmount(newStyles);
  newStyles = process_old_to_new_AutoSlideBehaviour(newStyles);

  ///----------- STYLING -------------///

  newStyles = changeNames(newStyles, nameChangedStylingParams);

  delete newStyles.textBoxWidthPercent;
  delete newStyles.enableLeanGallery;
  delete newStyles.fullscreen;
  delete newStyles.magicLayoutSeed;
  delete newStyles.gridStyle;
  return newStyles;
}

//----- refactor functions ----------//
function process_old_to_new_columnRatios(obj) {
  let _obj = { ...obj };

  _obj = namingChange(
    _obj,
    'columnWidths',
    optionsMap.layoutParams.columnRatios
  );
  if (_obj.layoutParams.columnRatios.length === 0) {
    _obj.layoutParams.columnRatios = [];
  } else {
    _obj.layoutParams.columnRatios = [
      ..._obj.layoutParams.columnRatios.split(',').map(Number),
    ];
  }
  return _obj;
}
function process_old_to_new_targetItemSizeValue(obj) {
  let _obj = { ...obj };
  let unit = _obj.layoutParams.targetItemSize.unit;
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

  delete _obj.gallerySizePx;
  delete _obj.gallerySizeRatio;
  delete _obj.gallerySize;

  return _obj;
}
function process_old_to_new_ThumbnailAlignment(obj) {
  //['galleryThumbnailsAlignment', optionsMap.layoutParams.thumbnails.alignment'],
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'galleryThumbnailsAlignment',
    optionsMap.layoutParams.thumbnails.alignment
  );
  _obj.layoutParams.thumbnails.alignment =
    _obj.layoutParams.thumbnails.alignment?.toUpperCase();
  return _obj;
}
function process_old_to_new_VideoPlayTrigger(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'videoPlay',
    optionsMap.behaviourParams.item.video.playTrigger
  );
  _obj.behaviourParams.item.video.playTrigger =
    _obj.behaviourParams.item.video.playTrigger?.toUpperCase();
  return _obj;
}
function process_old_to_new_targetItemSizeUnit(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'gallerySizeType',
    optionsMap.layoutParams.targetItemSize.unit
  );
  _obj.layoutParams.targetItemSize.unit =
    _obj.layoutParams.targetItemSize.unit?.toUpperCase();
  return _obj;
}
function process_old_to_new_VideoVolume(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'videoSound',
    optionsMap.behaviourParams.item.video.volume
  );
  _obj.behaviourParams.item.video.volume = _obj.behaviourParams.item.video
    .volume
    ? _obj.behaviourParams.item.video.volume
    : 0;
  return _obj;
}
function process_old_to_new_VideoSpeed(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'videoSpeed',
    optionsMap.behaviourParams.item.video.speed
  );
  _obj.behaviourParams.item.video.volume = Number(
    _obj.behaviourParams.item.video.volume
  );
  return _obj;
}
function process_old_to_new_ScrollDirection(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'scrollDirection',
    optionsMap.layoutParams.scrollDirection
  );
  switch (_obj.layoutParams.scrollDirection) {
    case 0:
      _obj.layoutParams.scrollDirection = 'VERTICAL';
      break;
    case 1:
      _obj.layoutParams.scrollDirection = 'HORIZONTAL';
      break;
    default:
      break;
  }
  return _obj;
}
function process_old_to_new_layoutDirection(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'isRTL',
    optionsMap.behaviourParams.gallery.layoutDirection
  );
  switch (_obj.behaviourParams.gallery.layoutDirection) {
    case true:
      _obj.behaviourParams.gallery.layoutDirection = 'RIGHT_TO_LEFT';
      break;
    case false:
      _obj.behaviourParams.gallery.layoutDirection = 'LEFT_TO_RIGHT';
      break;
    default:
      break;
  }
  return _obj;
}
function process_old_to_new_textBoxSizeMode(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'calculateTextBoxWidthMode',
    optionsMap.layoutParams.info.sizeCalculationMode
  );
  switch (_obj.layoutParams.info.sizeCalculationMode) {
    case 'PERCENT':
      _obj.layoutParams.info.sizeCalculationMode = 'PERCENT';
      break;
    case 'MANUAL':
      _obj.layoutParams.info.sizeCalculationMode = 'PIXEL';
      break;
    default:
      break;
  }
  return _obj;
}
function process_old_to_new_LayoutOrientation(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'isVertical',
    optionsMap.layoutParams.layoutOrientation
  );
  switch (_obj.layoutParams.layoutOrientation) {
    case true:
      _obj.layoutParams.layoutOrientation = 'VERTICAL';
      break;
    case false:
      _obj.layoutParams.layoutOrientation = 'HORIZONTAL';
      break;
    default:
      break;
  }
  return _obj;
}
function process_old_to_new_ForceGroupsOrder(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'placeGroupsLtr',
    optionsMap.layoutParams.forceGroupsOrder
  );
  switch (_obj.layoutParams.forceGroupsOrder) {
    case true:
      _obj.layoutParams.forceGroupsOrder = 'LEFT_TO_RIGHT';
      break;
    case false:
      _obj.layoutParams.forceGroupsOrder = 'BY_COLUMNS';
      break;
    default:
      break;
  }
  // 'RIGHT_TO_LEFT' doesnt exist yet.
  return _obj;
}
function process_old_to_new_LoadMoreAmount(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'loadMoreAmount',
    optionsMap.behaviourParams.gallery.vertical.loadMore.amount
  );
  _obj.behaviourParams.gallery.vertical.loadMore.amount =
    _obj.behaviourParams.gallery.vertical.loadMore.amount?.toUpperCase();
  return _obj;
}
function process_old_to_new_CroppedAlignment(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'cubeFitPosition',
    optionsMap.layoutParams.croppedAlignment
  );
  switch (_obj.layoutParams.croppedAlignment) {
    case 'MIDDLE':
      _obj.layoutParams.croppedAlignment = 'CENTER';
      break;
    default:
      break;
  }
  return _obj;
}
// function process_old_to_new_InfoBackgroundMode(obj) {
//   let _obj = { ...obj };
//   _obj = namingChange(
//     _obj,
//     'imageInfoType',
//     optionsMap.layoutParams.info.backgroundMode
//   );
//   switch (_obj.layoutParams.info.backgroundMode) {
//     case 'DONT_SHOW':
//       _obj.layoutParams.info.backgroundMode = 'NO_BACKGROUND';
//       break;
//     default:
//       break;
//   }
//   return _obj;
// }
function process_old_to_new_OverlayHoveringBehaviour(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'hoveringBehaviour',
    optionsMap.behaviourParams.item.overlay.hoveringBehaviour
  );
  switch (_obj.behaviourParams.item.overlay.hoveringBehaviour) {
    case 'NO_CHANGE':
      _obj.behaviourParams.item.overlay.hoveringBehaviour = 'ALWAYS_VISIBLE';
      break;
    case 'NEVER_SHOW':
      _obj.behaviourParams.item.overlay.hoveringBehaviour = 'NEVER_VISIBLE';
      break;
    default:
      break;
  }
  return _obj;
}
function process_old_to_new_InfoPlacement(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'titlePlacement',
    optionsMap.layoutParams.info.placement
  );
  switch (_obj.layoutParams.info.placement) {
    case 'SHOW_ON_HOVER':
      _obj.layoutParams.info.placement = 'OVERLAY';
      break;
    case 'SHOW_BELOW':
      _obj.layoutParams.info.placement = 'BELOW';
      break;
    case 'SHOW_ABOVE':
      _obj.layoutParams.info.placement = 'ABOVE';
      break;
    case 'SHOW_ON_THE_RIGHT':
      _obj.layoutParams.info.placement = 'RIGHT';
      break;
    case 'SHOW_ON_THE_LEFT':
      _obj.layoutParams.info.placement = 'LEFT';
      break;
    case 'ALTERNATE_HORIZONTAL':
      _obj.layoutParams.info.placement = 'ALTERNATE_HORIZONTALLY';
      break;
    case 'ALTERNATE_VERTICAL':
      _obj.layoutParams.info.placement = 'ALTERNATE_VERTICALLY';
      break;
    default:
      break;
  }
  return _obj;
}
function process_old_to_new_ClickAction(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'itemClick',
    optionsMap.behaviourParams.item.clickAction
  );
  _obj.behaviourParams.item.clickAction =
    _obj.behaviourParams.item.clickAction.toUpperCase();
  switch (_obj.behaviourParams.item.clickAction) {
    case 'FULLSCREEN':
    case 'EXPAND':
      _obj.behaviourParams.item.clickAction = 'ACTION';
      break;
    default:
      break;
  }
  return _obj;
}
function process_old_to_new_AutoSlideBehaviour(obj) {
  let _obj = { ...obj };
  let isAutoSlide = _obj.isAutoSlideshow;
  let autoSlideshowType = _obj.autoSlideshowType;
  let finalVal;
  if (!isAutoSlide) {
    finalVal = 'OFF';
  } else {
    if (autoSlideshowType === 'interval') {
      finalVal = 'INTERVAL';
    } else {
      finalVal = 'CONTINUOUS';
    }
  }
  _obj = assignByString(
    _obj,
    optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour,
    finalVal
  );
  delete _obj.isAutoSlideshow;
  delete _obj.autoSlideshowType;
  return _obj;
}
function process_old_to_new_CropRatio(obj) {
  let _obj = { ...obj };
  //['groupTypes', optionsMap.layoutParams.collage.groupTypes'], //Need to change this to incorporate rotatingGroupTypes //change the 'Types'?
  let repeatingVal = obj.rotatingCropRatios;
  let val = obj.cubeRatio || obj.layoutParams?.cropRatio;

  let finalVal;
  if (typeof repeatingVal === 'string' && repeatingVal !== '') {
    finalVal = repeatingVal;
  } else {
    finalVal = val;
  }
  _obj.layoutParams.cropRatio = String(finalVal).split(',').map(Number);
  delete _obj.cropRatio;
  delete _obj.rotatingCropRatios;
  return _obj;
}
function process_old_to_new_GroupTypes(obj) {
  let _obj = { ...obj };
  //['groupTypes', optionsMap.layoutParams.collage.groupTypes'], //Need to change this to incorporate rotatingGroupTypes //change the 'Types'?
  let repeatingVal =
    obj.rotatingGroupTypes || obj.layoutParams?.repeatingGroupTypes;
  let val = obj.groupTypes;
  let finalVal;
  if (typeof repeatingVal === 'string' && repeatingVal !== '') {
    finalVal = repeatingVal;
  } else {
    finalVal = val;
  }
  _obj.layoutParams.groupTypes = finalVal.split(',');
  delete _obj.layoutParams.repeatingGroupTypes;
  delete _obj.groupTypes;
  delete _obj.repeatingGroupTypes;
  return _obj;
}
function process_old_to_new_NumberOfColumns(obj) {
  let _obj = { ...obj };
  let fixedColumns = obj.fixedColumns;
  let numberOfImagesPerRow = obj.numberOfImagesPerRow;
  let numberOfGroupsPerRow = obj.groupsPerStrip;
  let finalVal = fixedColumns || numberOfImagesPerRow || numberOfGroupsPerRow;

  _obj.layoutParams.numberOfColumns = finalVal;
  delete _obj.fixedColumns;
  delete _obj.numberOfImagesPerRow;
  delete _obj.groupsPerStrip;
  return _obj;
}

export {
  convertOptions,
  convertOptionsBackwards,
  migrateOptions,
  addMigratedOptions,
};
