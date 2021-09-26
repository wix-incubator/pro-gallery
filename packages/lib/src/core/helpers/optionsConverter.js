import {
  assignByString,
  mergeNestedObjects,
  trimUndefinedValues,
} from './optionsUtils';
import cloneDeep from 'lodash/cloneDeep';
import { isLayout } from '../../common/constants/layout';
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

function addMigratedOptions(options) {
  const migrated = migrateOptions(options);
  let combinedOptions = mergeNestedObjects(
    trimUndefinedValues(migrated),
    trimUndefinedValues(options)
  );
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
  newStyles = process_old_to_new_gallerySpacing(newStyles);
  newStyles = process_old_to_new_slideshowInfoSize(newStyles);
  newStyles = process_old_to_new_arrowsPosition(newStyles);

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
  newStyles = process_old_to_new_galleryTextAlign(newStyles);

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
  if (_obj.layoutParams?.structure?.columnRatios?.length === 0) {
    _obj.layoutParams.structure.columnRatios = [];
  } else {
    _obj.layoutParams.structure.columnRatios = _obj.layoutParams?.structure
      ?.columnRatios
      ? _obj.layoutParams?.structure?.columnRatios?.split
        ? [
            ..._obj.layoutParams?.structure?.columnRatios
              ?.split(',')
              .map(Number),
          ]
        : _obj.layoutParams?.structure?.columnRatios
      : undefined;
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
  _obj.layoutParams.crop.method = _obj.layoutParams.crop?.method?.toUpperCase();
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
    _obj.layoutParams?.thumbnails?.alignment?.toUpperCase();
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
    _obj.behaviourParams?.item?.video?.playTrigger?.toUpperCase();
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
  if (typeof _obj.behaviourParams.item.video.volume !== 'undefined') {
    _obj.behaviourParams.item.video.volume = Number(
      _obj.behaviourParams.item.video.volume
    );
  }
  return _obj;
}
function process_old_to_new_VideoSpeed(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'videoSpeed',
    optionsMap.behaviourParams.item.video.speed
  );
  _obj.behaviourParams.item.video.speed =
    Number(_obj.behaviourParams.item.video.speed) >= 0
      ? Number(_obj.behaviourParams.item.video.speed)
      : undefined;
  return _obj;
}
function process_old_to_new_gallerySpacing(obj) {
  if (typeof obj.layoutParams?.structure?.gallerySpacing !== 'undefined') {
    return obj;
  }
  let _obj = { ...obj };
  let spacingVal;
  if (_obj.layoutParams?.gallerySpacing >= 0) {
    spacingVal = _obj.layoutParams?.gallerySpacing;
  } else if (_obj.galleryMargin >= 0) {
    spacingVal = _obj.galleryMargin;
  }
  assignByString(
    _obj,
    optionsMap.layoutParams.structure.gallerySpacing,
    spacingVal
  );
  delete _obj.layoutParams?.gallerySpacing;
  delete _obj.galleryMargin;
  return _obj;
}
function process_old_to_new_arrowsPosition(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'arrowsPosition',
    optionsMap.layoutParams.navigationArrows.position
  );
  switch (_obj.layoutParams?.navigationArrows?.position) {
    case 0:
      _obj.layoutParams.navigationArrows.position = 'ON_GALLERY';
      break;
    case 1:
      _obj.layoutParams.navigationArrows.position = 'OUTSIDE_GALLERY';
      break;
    default:
      break;
  }
  return _obj;
}
function process_old_to_new_responsiveMode(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'gridStyle',
    optionsMap.layoutParams.structure.responsiveMode
  );
  switch (_obj.layoutParams?.structure?.responsiveMode) {
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
    optionsMap.layoutParams.structure.scrollDirection
  );
  switch (_obj.layoutParams?.structure?.scrollDirection) {
    case 0:
      _obj.layoutParams.structure.scrollDirection = 'VERTICAL';
      break;
    case 1:
      _obj.layoutParams.structure.scrollDirection = 'HORIZONTAL';
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
function process_old_to_new_slideshowInfoSize(obj) {
  let _obj = { ...obj };
  const isSlideshow = isLayout('SLIDESHOW')({
    galleryLayout:
      obj.galleryLayout >= -3
        ? obj.galleryLayout
        : obj.layoutParams?.structure?.galleryLayout,
  });
  if (isSlideshow) {
    _obj = namingChange(
      _obj,
      'slideshowInfoSize',
      optionsMap.layoutParams.info.height
    );
  } else {
    _obj = namingChange(
      _obj,
      'textBoxHeight',
      optionsMap.layoutParams.info.height
    );
  }
  delete _obj.slideshowInfoSize;
  delete _obj.textBoxHeight;
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
function process_old_to_new_galleryTextAlign(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'galleryTextAlign',
    optionsMap.behaviourParams.gallery.horizontal.slideshowInfo.buttonsAlignment
  );
  _obj.behaviourParams.gallery.horizontal.slideshowInfo.buttonsAlignment =
    _obj.behaviourParams?.gallery?.horizontal?.slideshowInfo?.buttonsAlignment?.toUpperCase();
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
    _obj.behaviourParams?.gallery?.vertical?.loadMore?.amount?.toUpperCase();
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
    _obj.behaviourParams?.item?.clickAction?.toUpperCase();
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
  if (
    typeof obj.behaviourParams?.gallery?.horizontal?.autoSlide?.behaviour !==
    'undefined'
  ) {
    return obj;
  }
  let _obj = { ...obj };
  let isAutoSlide = _obj.isAutoSlideshow;
  let autoSlideshowType = _obj.autoSlideshowType;
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
  if (typeof obj.layoutParams?.crop?.ratios !== 'undefined') {
    return obj;
  }
  let _obj = { ...obj };
  let repeatingVal = obj.rotatingCropRatios;
  let val = _obj.cubeRatio || _obj.layoutParams?.cropRatio;
  let finalVal;
  if (typeof repeatingVal === 'string' && repeatingVal !== '') {
    finalVal = repeatingVal;
  } else {
    finalVal = val;
  }
  _obj.layoutParams.crop.ratios =
    finalVal && String(finalVal).split(',').map(Number);
  delete _obj.cubeRatio;
  delete _obj.layoutParams.cropRatio;
  delete _obj.rotatingCropRatios;
  return _obj;
}
function process_old_to_new_AllowedGroupTypes(obj) {
  if (typeof obj.layoutParams?.groups?.allowedGroupTypes !== 'undefined') {
    return obj;
  }
  let _obj = { ...obj };

  _obj.layoutParams.groups.allowedGroupTypes = _obj.groupTypes?.split
    ? _obj.groupTypes.split(',')
    : _obj.groupTypes
    ? _obj.groupTypes
    : undefined;
  delete _obj.groupTypes;
  return _obj;
}
function process_old_to_new_repeatingGroupTypes(obj) {
  if (typeof obj.layoutParams?.groups?.repeatingGroupTypes !== 'undefined') {
    return obj;
  }
  let _obj = { ...obj };
  let repeatingVal =
    obj.rotatingGroupTypes || obj.layoutParams?.repeatingGroupTypes;
  let finalVal;
  if (typeof repeatingVal === 'string' && repeatingVal !== '') {
    finalVal = repeatingVal.split(',');
  } else if (typeof repeatingVal === 'string' && repeatingVal === '') {
    finalVal = [];
  } else {
    finalVal = undefined;
  }
  _obj = assignByString(
    _obj,
    optionsMap.layoutParams.groups.repeatingGroupTypes,
    finalVal
  );
  delete _obj.layoutParams.repeatingGroupTypes;
  delete _obj.rotatingGroupTypes;
  return _obj;
}
function process_old_to_new_NumberOfColumns(obj) {
  if (typeof obj.layoutParams?.structure?.numberOfColumns !== 'undefined') {
    return obj;
  }
  let _obj = { ...obj };
  const fixedColumns = obj.fixedColumns;
  const numberOfImagesPerRow = obj.numberOfImagesPerRow;
  const finalVal =
    numberOfImagesPerRow >= 0
      ? numberOfImagesPerRow
      : fixedColumns >= 0
      ? fixedColumns
      : undefined;

  _obj.layoutParams.structure.numberOfColumns = finalVal;
  delete _obj.fixedColumns;
  delete _obj.numberOfImagesPerRow;
  return _obj;
}

export { migrateOptions, addMigratedOptions };
