import itemClick from './itemClick';
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
import arrowsColor from './arrowsColor';
import optionsMap from '../../core/helpers/optionsMap';
import layoutParams_navigationArrows_type from './layoutParams_navigationArrows_type';

export default {
  layoutParams_gallerySpacing,
  [optionsMap.layoutParams.structure.gallerySpacing]:
    layoutParams_gallerySpacing,
  layoutParams_cropRatio,
  layoutParams_repeatingGroupTypes,
  itemClick,
  [optionsMap.behaviourParams.item.clickAction]: itemClick,
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
  [optionsMap.behaviourParams.gallery.horizontal.slideshowInfo
    .buttonsAlignment]: galleryTextAlign,
  videoPlay,
  [optionsMap.behaviourParams.item.video.playTrigger]: videoPlay,
  imageHoverAnimation,
  [optionsMap.behaviourParams.item.content.hoverAnimation]: imageHoverAnimation,
  overlayAnimation,
  [optionsMap.behaviourParams.item.overlay.hoverAnimation]: overlayAnimation,
  textImageSpace,
  [optionsMap.layoutParams.info.spacing]: textImageSpace,
  textBoxBorderColor,
  [optionsMap.layoutParams.info.border.color]: textBoxBorderColor,
  textBoxBorderRadius,
  [optionsMap.layoutParams.info.border.radius]: textBoxBorderRadius,
  textBoxBorderWidth,
  [optionsMap.layoutParams.info.border.width]: textBoxBorderWidth,
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
  [optionsMap.behaviourParams.gallery.layoutDirection]: isRTL,
  scrollSnap,
  itemBorderWidth,
  [optionsMap.stylingParams.itemBorderWidth]: itemBorderWidth,
  itemBorderRadius,
  [optionsMap.stylingParams.itemBorderRadius]: itemBorderRadius,
  itemBorderColor,
  rotatingCropRatios,
  columnWidths,
  autoSlideshowInterval,
  [optionsMap.behaviourParams.gallery.horizontal.autoSlide.interval]:
    autoSlideshowInterval,
  smartCrop,
  minItemSize,
  scrollAnimation,
  [optionsMap.behaviourParams.gallery.scrollAnimation]: scrollAnimation,
  slideAnimation,
  [optionsMap.behaviourParams.gallery.horizontal.slideAnimation]:
    slideAnimation,
  scatter,
  rotatingScatter,
  thumbnailSpacings,
  [optionsMap.layoutParams.thumbnails.spacing]: thumbnailSpacings,
  slideshowLoop,
  [optionsMap.behaviourParams.gallery.horizontal.loop]: slideshowLoop,
  arrowsPadding,
  [optionsMap.layoutParams.navigationArrows.padding]: arrowsPadding,
  arrowsSize,
  [optionsMap.layoutParams.navigationArrows.size]: arrowsSize,
  slideshowInfoSize,
  textBoxHeight,
  [optionsMap.layoutParams.info.height]: textBoxHeight,
  calculateTextBoxWidthMode,
  [optionsMap.layoutParams.info.sizeUnits]: calculateTextBoxWidthMode,
  chooseBestGroup,
  imageLoadingMode,
  [optionsMap.behaviourParams.item.content.loader]: imageLoadingMode,
  cropOnlyFill,
  groupsPerStrip,
  fixedColumns,
  arrowsPosition,
  [optionsMap.layoutParams.navigationArrows.position]: arrowsPosition,
  arrowsVerticalPosition,
  [optionsMap.layoutParams.navigationArrows.verticalAlignment]:
    arrowsVerticalPosition,
  itemShadowSize,
  [optionsMap.stylingParams.itemShadowSize]: itemShadowSize,
  itemShadowBlur,
  [optionsMap.stylingParams.itemShadowBlur]: itemShadowBlur,
  itemShadowDirection,
  [optionsMap.stylingParams.itemShadowDirection]: itemShadowDirection,
  itemShadowOpacityAndColor,
  [optionsMap.stylingParams.itemShadowOpacityAndColor]:
    itemShadowOpacityAndColor,
  itemEnableShadow,
  [optionsMap.stylingParams.itemEnableShadow]: itemEnableShadow,
  videoLoop,
  [optionsMap.behaviourParams.item.video.loop]: videoLoop,
  showArrows,
  [optionsMap.layoutParams.navigationArrows.enable]: showArrows,
  enableScroll,
  [optionsMap.behaviourParams.gallery.horizontal.blockScroll]: enableScroll,
  imagePlacementAnimation,
  [optionsMap.behaviourParams.item.content.placementAnimation]:
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
  [optionsMap.behaviourParams.gallery.vertical.loadMore.amount]: loadMoreAmount,
  videoSound,
  [optionsMap.behaviourParams.item.video.volume]: videoSound,
  videoSpeed,
  [optionsMap.behaviourParams.item.video.speed]: videoSpeed,
  allowSlideshowCounter,
  [optionsMap.behaviourParams.gallery.horizontal.slideshowInfo.enableCounter]:
    allowSlideshowCounter,
  playButtonForAutoSlideShow,
  [optionsMap.behaviourParams.gallery.horizontal.slideshowInfo
    .enablePlayButton]: playButtonForAutoSlideShow,
  hidePlay,
  [optionsMap.behaviourParams.item.video.enablePlayButton]: hidePlay,
  overlayBackground,
  allowLeanGallery,
  placeGroupsLtr,
  showVideoControls,
  [optionsMap.behaviourParams.item.video.enableControls]: showVideoControls,
  pauseAutoSlideshowOnHover,
  [optionsMap.behaviourParams.gallery.horizontal.autoSlide.pauseOnHover]:
    pauseAutoSlideshowOnHover,
  shouldIndexDirectShareLinkInSEO,
  [optionsMap.behaviourParams.gallery.enableIndexingShareLinks]:
    shouldIndexDirectShareLinkInSEO,
  slideTransition,
  [optionsMap.behaviourParams.gallery.horizontal.slideTransition]:
    slideTransition,
  useMaxDimensions,
  cubeFitPosition,
  enableVideoPlaceholder,
  [optionsMap.behaviourParams.item.video.enablePlaceholder]:
    enableVideoPlaceholder,
  overlayPosition,
  [optionsMap.behaviourParams.item.overlay.position]: overlayPosition,
  overlaySize,
  [optionsMap.behaviourParams.item.overlay.size]: overlaySize,
  overlaySizeType,
  [optionsMap.behaviourParams.item.overlay.sizeUnits]: overlaySizeType,
  overlayPadding,
  [optionsMap.behaviourParams.item.overlay.padding]: overlayPadding,
  autoSlideshowType,
  [optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour]:
    autoSlideshowType,
  autoSlideshowContinuousSpeed,
  behaviourParams_item_content_magnificationValue,
  arrowsColor,
  [optionsMap.stylingParams.arrowsColor]: arrowsColor,
  [optionsMap.layoutParams.navigationArrows.type]:
    layoutParams_navigationArrows_type,
};

// TODO = add the options:
/*
itemOpacity
imageLoadingColor
oneColorAnimationColor
*/
