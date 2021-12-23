import itemClick from './itemClick';
import behaviourParams_item_clickAction from './itemClick';
import imageMargin from './imageMargin';
import hoveringBehaviour from './hoveringBehaviour';
import enableInfiniteScroll from './enableInfiniteScroll';
import cubeType from './cubeType';
import cubeImages from './cubeImages';
import layoutParams_cropRatio from './cropRatio';
import titlePlacement from './titlePlacement';
import layoutParams_gallerySpacing from './gallerySpacing';
import isVertical from './isVertical';
import numberOfImagesPerRow from './numberOfImagesPerRow';
import numberOfImagesPerCol from './numberOfImagesPerCol';
import layoutParams_structure_numberOfGridRows from './numberOfImagesPerCol';
import galleryTextAlign from './galleryTextAlign';
import videoPlay from './videoPlay';
import imageHoverAnimation from './imageHoverAnimation';
import overlayAnimation from './overlayAnimation';
import textImageSpace from './textImageSpace';
import textBoxBorderColor from './textBoxBorderColor';
import textBoxBorderRadius from './textBoxBorderRadius';
import textBoxBorderWidth from './textBoxBorderWidth';
import textBoxWidth from './textBoxWidth';
import textBoxWidthPercent from './textBoxWidthPercent';
import imageInfoType from './imageInfoType';
import groupSize from './groupSize';
import collageDensity from './collageDensity';
import gridStyle from './gridStyle';
import hasThumbnails from './hasThumbnails';
import groupTypes from './groupTypes';
import thumbnailSize from './thumbnailSize';
import galleryThumbnailsAlignment from './galleryThumbnailsAlignment';
import isRTL from './isRTL';
import scrollSnap from './scrollSnap';
import itemBorderWidth from './itemBorderWidth';
import itemBorderRadius from './itemBorderRadius';
import itemBorderColor from './itemBorderColor';
import rotatingCropRatios from './rotatingCropRatios';
import columnWidths from './columnWidths';
import autoSlideshowInterval from './autoSlideshowInterval';
import smartCrop from './smartCrop';
import minItemSize from './minItemSize';
import scrollAnimation from './scrollAnimation';
import slideAnimation from './slideAnimation';
import scatter from './scatter';
import rotatingScatter from './rotatingScatter';
import thumbnailSpacings from './thumbnailSpacings';
import slideshowLoop from './slideshowLoop';
import arrowsPadding from './arrowsPadding';
import arrowsSize from './arrowsSize';
import slideshowInfoSize from './slideshowInfoSize';
import textBoxHeight from './textBoxHeight';
import calculateTextBoxWidthMode from './calculateTextBoxWidthMode';
import chooseBestGroup from './chooseBestGroup';
import imageLoadingMode from './imageLoadingMode';
import cropOnlyFill from './cropOnlyFill';
import groupsPerStrip from './groupsPerStrip';
import fixedColumns from './fixedColumns';
import layoutParams_repeatingGroupTypes from './repeatingGroupTypes';
import arrowsPosition from './arrowsPosition';
import arrowsVerticalPosition from './arrowsVerticalPosition';
import itemShadowSize from './itemShadowSize';
import itemShadowBlur from './itemShadowBlur';
import itemShadowDirection from './itemShadowDirection';
import itemShadowOpacityAndColor from './itemShadowOpacityAndColor';
import itemEnableShadow from './itemEnableShadow';
import videoLoop from './videoLoop';
import showArrows from './showArrows';
import enableScroll from './enableScroll';
import imagePlacementAnimation from './imagePlacementAnimation';
import gallerySizeType from './gallerySizeType';
import gallerySize from './gallerySize';
import gallerySizePx from './gallerySizePx';
import gallerySizeRatio from './gallerySizeRatio';
import allowContextMenu from './allowContextMenu';
import galleryLayout from './galleryLayout';
import scrollDirection from './scrollDirection';
import scrollDuration from './scrollDuration';
import isAutoSlideshow from './isAutoSlideshow';
import loadMoreAmount from './loadMoreAmount';
import videoSound from './videoSound';
import videoSpeed from './videoSpeed';
import allowSlideshowCounter from './allowSlideshowCounter';
import playButtonForAutoSlideShow from './playButtonForAutoSlideShow';
import hidePlay from './hidePlay';
import overlayBackground from './overlayBackground';
import allowLeanGallery from './allowLeanGallery';
import placeGroupsLtr from './placeGroupsLtr';
import pauseAutoSlideshowOnHover from './pauseAutoSlideshowOnHover';
import showVideoControls from './showVideoControls';
import shouldIndexDirectShareLinkInSEO from './shouldIndexDirectShareLinkInSEO';
import slideTransition from './slideTransition';
import useMaxDimensions from './useMaxDimensions';
import cubeFitPosition from './cubeFitPosition';
import enableVideoPlaceholder from './enableVideoPlaceholder ';
import overlayPosition from './overlayPosition';
import overlaySize from './overlaySize';
import overlaySizeType from './overlaySizeType';
import overlayPadding from './overlayPadding';
import autoSlideshowType from './autoSlideshowType';
import autoSlideshowContinuousSpeed from './autoSlideshowContinuousSpeed';
import behaviourParams_item_content_magnificationValue from './magnificationValue';
import optionsMap from '../../core/helpers/optionsMap';
import arrowsContainerStyleType from './arrowsContainerStyleType';
import arrowsContainerBackgroundColor from './arrowsContainerBackgroundColor';
import arrowsContainerBorderRadius from './arrowsContainerBorderRadius';

export default {
  layoutParams_gallerySpacing,
  layoutParams_cropRatio,
  layoutParams_repeatingGroupTypes,
  itemClick,
  behaviourParams_item_clickAction,
  imageMargin,
  [optionsMap.layoutParams.structure.itemSpacing]: imageMargin,
  hoveringBehaviour,
  [optionsMap.behaviourParams.item.overlay.hoveringBehaviour]:
    hoveringBehaviour,
  enableInfiniteScroll,
  [optionsMap.behaviourParams.gallery.vertical.loadMore.enable]:
    enableInfiniteScroll,
  cubeType,
  [optionsMap.layoutParams.crop.method]: cubeType,
  cubeImages,
  [optionsMap.layoutParams.crop.enable]: cubeImages,
  titlePlacement,
  [optionsMap.layoutParams.info.placement]: titlePlacement,
  isVertical,
  [optionsMap.layoutParams.structure.layoutOrientation]: isVertical,
  numberOfImagesPerRow,
  numberOfImagesPerCol,
  layoutParams_structure_numberOfGridRows,
  galleryTextAlign,
  videoPlay,
  imageHoverAnimation,
  overlayAnimation,
  textImageSpace,
  [optionsMap.layoutParams.info.spacing]: textImageSpace,
  textBoxBorderColor,
  textBoxBorderRadius,
  textBoxBorderWidth,
  textBoxWidth,
  textBoxWidthPercent,
  imageInfoType,
  groupSize,
  collageDensity,
  [optionsMap.layoutParams.groups.density]: collageDensity,
  gridStyle,
  [optionsMap.layoutParams.structure.responsiveMode]: gridStyle,
  hasThumbnails,
  groupTypes,
  thumbnailSize,
  [optionsMap.layoutParams.thumbnails.size]: thumbnailSize,
  galleryThumbnailsAlignment,
  [optionsMap.layoutParams.thumbnails.alignment]: galleryThumbnailsAlignment,
  isRTL,
  scrollSnap,
  itemBorderWidth,
  itemBorderRadius,
  itemBorderColor,
  rotatingCropRatios,
  columnWidths,
  autoSlideshowInterval,
  [optionsMap.behaviourParams.gallery.horizontal.autoSlide.interval]:
    autoSlideshowInterval,
  smartCrop,
  minItemSize,
  scrollAnimation,
  slideAnimation,
  scatter,
  rotatingScatter,
  thumbnailSpacings,
  [optionsMap.layoutParams.thumbnails.spacing]: thumbnailSpacings,
  slideshowLoop,
  [optionsMap.behaviourParams.gallery.horizontal.loop]: slideshowLoop,
  arrowsPadding,
  arrowsSize,
  [optionsMap.layoutParams.navigationArrows.size]: arrowsSize,
  slideshowInfoSize,
  textBoxHeight,
  calculateTextBoxWidthMode,
  [optionsMap.layoutParams.info.sizeUnits]: calculateTextBoxWidthMode,
  chooseBestGroup,
  imageLoadingMode,
  cropOnlyFill,
  groupsPerStrip,
  fixedColumns,
  arrowsPosition,
  [optionsMap.layoutParams.navigationArrows.position]: arrowsPosition,
  arrowsVerticalPosition,
  [optionsMap.layoutParams.navigationArrows.verticalAlignment]:
    arrowsVerticalPosition,
  itemShadowSize,
  itemShadowBlur,
  itemShadowDirection,
  itemShadowOpacityAndColor,
  itemEnableShadow,
  videoLoop,
  showArrows,
  [optionsMap.layoutParams.navigationArrows.enable]: showArrows,
  enableScroll,
  imagePlacementAnimation,
  gallerySizeType,
  gallerySize,
  gallerySizePx,
  gallerySizeRatio,
  allowContextMenu,
  galleryLayout,
  [optionsMap.layoutParams.structure.galleryLayout]: galleryLayout,
  scrollDirection,
  [optionsMap.layoutParams.structure.scrollDirection]: scrollDirection,
  scrollDuration,
  [optionsMap.behaviourParams.gallery.horizontal.navigationDuration]:
    scrollDuration,
  isAutoSlideshow,
  loadMoreAmount,
  videoSound,
  videoSpeed,
  allowSlideshowCounter,
  [optionsMap.behaviourParams.gallery.horizontal.slideshowInfo.enableCounter]:
    allowSlideshowCounter,
  playButtonForAutoSlideShow,
  [optionsMap.behaviourParams.gallery.horizontal.slideshowInfo
    .enablePlayButton]: playButtonForAutoSlideShow,
  hidePlay,
  overlayBackground,
  allowLeanGallery,
  placeGroupsLtr,
  showVideoControls,
  pauseAutoSlideshowOnHover,
  [optionsMap.behaviourParams.gallery.horizontal.autoSlide.pauseOnHover]:
    pauseAutoSlideshowOnHover,
  shouldIndexDirectShareLinkInSEO,
  slideTransition,
  useMaxDimensions,
  cubeFitPosition,
  enableVideoPlaceholder,
  overlayPosition,
  overlaySize,
  overlaySizeType,
  overlayPadding,
  autoSlideshowType,
  autoSlideshowContinuousSpeed,
  behaviourParams_item_content_magnificationValue,
  [optionsMap.layoutParams.navigationArrows.arrowsContainerStyleType]:
    arrowsContainerStyleType,
  [optionsMap.layoutParams.navigationArrows.arrowsContainerBackgroundColor]:
    arrowsContainerBackgroundColor,
  [optionsMap.layoutParams.navigationArrows.arrowsContainerBorderRadius]:
    arrowsContainerBorderRadius,
};

// TODO = add the options:
/*
itemOpacity
arrowsColor
imageLoadingColor
oneColorAnimationColor
*/
