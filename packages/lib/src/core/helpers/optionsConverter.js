import { assignByString, mergeNestedObjects } from './optionsUtils';
import cloneDeep from 'lodash/cloneDeep';

import optionsMap from './optionsMap';
import {
  nameChangedLayoutParams,
  nameChangedBehaviourParams,
  nameChangedStylingParams,
  reversedLayoutParams,
  reversedBehaviourParams,
  changeNames,
  namingChange,
  reverseBooleans,
} from './migratorStore';
function convertOptions(initialOptions) {
  //This will add the new names while keeping the old ones.
  let options = { ...initialOptions };
  options.layoutParams.cropRatio =
    options.layoutParams.cropRatio || initialOptions.cubeRatio || 1;
  options.layoutParams.gallerySpacing =
    options.layoutParams.gallerySpacing || initialOptions.galleryMargin || 0;
  options.layoutParams.repeatingGroupTypes =
    options.layoutParams.repeatingGroupTypes ||
    initialOptions.rotatingGroupTypes ||
    '';
  return options;
}

function convertOptionsBackwards(initialOptions) {
  //This will add the old names while keeping the new ones.
  let options = { ...initialOptions };
  options.cubeRatio = options.cubeRatio || options.layoutParams.cropRatio || 1;
  options.galleryMargin =
    options.galleryMargin || options.layoutParams.gallerySpacing || 0;
  options.rotatingGroupTypes =
    options.rotatingGroupTypes || options.layoutParams.repeatingGroupTypes;
  return options;
}

function addMigratedOptions(options) {
  let migrated = migrateOptions(options);
  let combinedOptions = mergeNestedObjects(migrated, options);
  delete combinedOptions.oldRefactoredOptionInCore;
  return combinedOptions;
}

function migrateOptions(oldStyles) {
  let newStyles = cloneDeep(oldStyles);
  ///----------- LAYOUT -------------///
  newStyles = changeNames(newStyles, nameChangedLayoutParams);
  newStyles = reverseBooleans(newStyles, reversedLayoutParams);
  newStyles = process_old_to_new_ThumbnailAlignment(newStyles);
  newStyles = process_old_to_new_ScrollDirection(newStyles);
  newStyles = process_old_to_new_LayoutOrientation(newStyles);
  newStyles = process_old_to_new_groupsOrder(newStyles);
  newStyles = process_old_to_new_repeatingGroupTypes(newStyles);
  newStyles = process_old_to_new_AllowedGroupTypes(newStyles);
  newStyles = process_old_to_new_NumberOfColumns(newStyles); // fixedColumns || numberOfImagesPerRow
  newStyles = process_old_to_new_targetItemSizeUnit(newStyles);
  newStyles = process_old_to_new_targetItemSizeValue(newStyles);
  newStyles = process_old_to_new_CroppedAlignment(newStyles);
  newStyles = process_old_to_new_CropRatio(newStyles);
  newStyles = process_old_to_new_textBoxSizeMode(newStyles);
  newStyles = process_old_to_new_columnRatios(newStyles);
  newStyles = process_old_to_new_cropMethod(newStyles);
  newStyles = process_old_to_new_responsiveMode(newStyles);

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
  delete newStyles.enableLeanGallery;
  delete newStyles.fullscreen;
  delete newStyles.magicLayoutSeed;
  return newStyles;
}

//----- refactor functions ----------//
function process_old_to_new_columnRatios(obj) {
  let _obj = { ...obj };

  _obj = namingChange(
    _obj,
    'columnWidths',
    optionsMap.layoutParams.structure.columnRatios
  );
  if (_obj.layoutParams.structure.columnRatios.length === 0) {
    _obj.layoutParams.structure.columnRatios = [];
  } else {
    _obj.layoutParams.structure.columnRatios = [
      ..._obj.layoutParams.structure.columnRatios.split(',').map(Number),
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
function process_old_to_new_cropMethod(obj) {
  let _obj = { ...obj };
  _obj = namingChange(_obj, 'cubeType', optionsMap.layoutParams.crop.method);
  _obj.layoutParams.crop.method = _obj.layoutParams.crop.method?.toUpperCase();
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
  switch (_obj.layoutParams.targetItemSize.unit) {
    case 'px':
      _obj.layoutParams.targetItemSize.unit = 'PIXEL';
      break;
    case 'ratio':
      _obj.layoutParams.targetItemSize.unit = 'PERCENT';
      break;
    case 'smart':
      _obj.layoutParams.targetItemSize.unit = 'SMART';
      break;
  }
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
  _obj.behaviourParams.item.video.speed = Number(
    _obj.behaviourParams.item.video.speed
  );
  return _obj;
}
function process_old_to_new_responsiveMode(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'gridStyle',
    optionsMap.layoutParams.structure.responsiveMode
  );
  switch (_obj.layoutParams.structure.responsiveMode) {
    case 0:
      _obj.layoutParams.structure.responsiveMode = 'FIT_TO_SCREEN';
      break;
    case 1:
      _obj.layoutParams.structure.responsiveMode = 'SET_ITEMS_PER_ROW';
      break;
    default:
      break;
  }
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
    optionsMap.layoutParams.info.sizeUnits
  );
  switch (_obj.layoutParams.info.sizeUnits) {
    case 'PERCENT':
      _obj.layoutParams.info.sizeUnits = 'PERCENT';
      _obj = namingChange(
        _obj,
        'textBoxWidthPercent',
        optionsMap.layoutParams.info.width
      );
      delete _obj['textBoxWidth'];
      break;
    case 'MANUAL':
      _obj.layoutParams.info.sizeUnits = 'PIXEL';
      _obj = namingChange(
        _obj,
        'textBoxWidth',
        optionsMap.layoutParams.info.width
      );
      delete _obj['textBoxWidthPercent'];
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
    optionsMap.layoutParams.structure.layoutOrientation
  );
  switch (_obj.layoutParams.structure.layoutOrientation) {
    case true:
      _obj.layoutParams.structure.layoutOrientation = 'VERTICAL';
      break;
    case false:
      _obj.layoutParams.structure.layoutOrientation = 'HORIZONTAL';
      break;
    default:
      break;
  }
  return _obj;
}
function process_old_to_new_groupsOrder(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'placeGroupsLtr',
    optionsMap.layoutParams.structure.groupsOrder
  );
  switch (_obj.layoutParams.structure.groupsOrder) {
    case true:
      _obj.layoutParams.structure.groupsOrder = 'LEFT_TO_RIGHT';
      break;
    case false:
      _obj.layoutParams.structure.groupsOrder = 'BY_HEIGHT';
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
    optionsMap.layoutParams.crop.alignment
  );
  switch (_obj.layoutParams.crop.alignment) {
    case 'MIDDLE':
      _obj.layoutParams.crop.alignment = 'CENTER';
      break;
    default:
      break;
  }
  return _obj;
}
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
  let repeatingVal = obj.rotatingCropRatios;
  let val = _obj.cubeRatio || _obj.layoutParams?.cropRatio;

  let finalVal;
  if (typeof repeatingVal === 'string' && repeatingVal !== '') {
    finalVal = repeatingVal;
  } else {
    finalVal = val;
  }
  _obj.layoutParams.crop.ratios = String(finalVal).split(',').map(Number);
  delete _obj.cropRatio;
  delete _obj.layoutParams.cropRatio;
  delete _obj.rotatingCropRatios;
  return _obj;
}
function process_old_to_new_AllowedGroupTypes(obj) {
  let _obj = { ...obj };

  let val = _obj.groupTypes;
  _obj.layoutParams.collage.allowedGroupTypes = val.split(',');
  delete _obj.groupTypes;
  return _obj;
}
function process_old_to_new_repeatingGroupTypes(obj) {
  let _obj = { ...obj };
  let repeatingVal =
    obj.rotatingGroupTypes || obj.layoutParams?.repeatingGroupTypes;
  let finalVal;
  if (typeof repeatingVal === 'string' && repeatingVal !== '') {
    finalVal = repeatingVal.split(',');
  } else {
    finalVal = [];
  }
  _obj = assignByString(
    _obj,
    optionsMap.layoutParams.collage.repeatingGroupTypes,
    finalVal
  );
  delete _obj.layoutParams.repeatingGroupTypes;
  delete _obj.repeatingGroupTypes;
  return _obj;
}
function process_old_to_new_NumberOfColumns(obj) {
  let _obj = { ...obj };
  let fixedColumns = obj.fixedColumns;
  let numberOfImagesPerRow = obj.numberOfImagesPerRow;
  let finalVal = fixedColumns || numberOfImagesPerRow;

  _obj.layoutParams.structure.numberOfColumns = finalVal;
  delete _obj.fixedColumns;
  delete _obj.numberOfImagesPerRow;
  return _obj;
}

export {
  convertOptions,
  convertOptionsBackwards,
  migrateOptions,
  addMigratedOptions,
};
