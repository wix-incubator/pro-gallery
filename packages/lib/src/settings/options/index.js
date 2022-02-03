import stylingParams_itemResolutionMode from './itemResolutionMode';
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
import loadMoreButtonText from './loadMoreButtonText';
import layoutParams_navigationArrows_type from './layoutParams_navigationArrows_type';
import layoutParams_navigationArrows_container_type from './layoutParams_navigationArrows_container_type';
import layoutParams_navigationArrows_container_backgroundColor from './layoutParams_navigationArrows_container_backgroundColor';
import layoutParams_navigationArrows_container_borderRadius from './layoutParams_navigationArrows_container_borderRadius';
import layoutParams_crop_ratios from './layoutParams_crop_ratios';
import behaviourParams_gallery_horizontal_autoSlide_behaviour from './behaviourParams_gallery_horizontal_autoSlide_behaviour';
import behaviourParams_gallery_horizontal_autoSlide_interval from './behaviourParams_gallery_horizontal_autoSlide_interval';
import behaviourParams_gallery_horizontal_autoSlide_speed from './behaviourParams_gallery_horizontal_autoSlide_speed';
import layoutParams_targetItemSize_value from './layoutParams_targetItemSize_value';

export default {
  [optionsMap.behaviourParams.gallery.vertical.loadMore.text]:
    loadMoreButtonText,
  layoutParams_gallerySpacing,
  [optionsMap.layoutParams.structure.gallerySpacing]:
    layoutParams_gallerySpacing,
  layoutParams_cropRatio,
  [optionsMap.layoutParams.crop.ratios]: layoutParams_crop_ratios,
  layoutParams_repeatingGroupTypes,
  [optionsMap.layoutParams.groups.repeatingGroupTypes]:
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
  [optionsMap.layoutParams.structure.numberOfGridRows]: numberOfImagesPerCol,
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
  [optionsMap.layoutParams.info.width]: textBoxWidthPercent,
  imageInfoType,
  [optionsMap.layoutParams.info.layout]: imageInfoType,
  groupSize,
  [optionsMap.layoutParams.groups.groupSize]: groupSize,
  collageDensity,
  [optionsMap.layoutParams.groups.density]: collageDensity,
  gridStyle,
  [optionsMap.layoutParams.structure.responsiveMode]: gridStyle,
  hasThumbnails,
  [optionsMap.layoutParams.thumbnails.enable]: hasThumbnails,
  groupTypes,
  [optionsMap.layoutParams.groups.allowedGroupTypes]: groupTypes,
  thumbnailSize,
  [optionsMap.layoutParams.thumbnails.size]: thumbnailSize,
  galleryThumbnailsAlignment,
  [optionsMap.layoutParams.thumbnails.alignment]: galleryThumbnailsAlignment,
  isRTL,
  [optionsMap.behaviourParams.gallery.layoutDirection]: isRTL,
  scrollSnap,
  [optionsMap.behaviourParams.gallery.horizontal.enableScrollSnap]: scrollSnap,
  itemBorderWidth,
  [optionsMap.stylingParams.itemBorderWidth]: itemBorderWidth,
  itemBorderRadius,
  [optionsMap.stylingParams.itemBorderRadius]: itemBorderRadius,
  itemBorderColor,
  rotatingCropRatios,
  columnWidths,
  [optionsMap.layoutParams.structure.columnRatios]: columnWidths,
  autoSlideshowInterval,
  [optionsMap.behaviourParams.gallery.horizontal.autoSlide.interval]:
    behaviourParams_gallery_horizontal_autoSlide_interval,
  smartCrop,
  [optionsMap.layoutParams.crop.enableSmartCrop]: smartCrop,
  minItemSize,
  [optionsMap.layoutParams.targetItemSize.minimum]: minItemSize,
  scrollAnimation,
  [optionsMap.behaviourParams.gallery.scrollAnimation]: scrollAnimation,
  slideAnimation,
  [optionsMap.behaviourParams.gallery.horizontal.slideAnimation]:
    slideAnimation,
  scatter,
  [optionsMap.layoutParams.structure.scatter.randomScatter]: scatter,
  rotatingScatter,
  [optionsMap.layoutParams.structure.scatter.manualScatter]: rotatingScatter,
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
  [optionsMap.layoutParams.groups.groupByOrientation]: chooseBestGroup,
  imageLoadingMode,
  [optionsMap.behaviourParams.item.content.loader]: imageLoadingMode,
  cropOnlyFill,
  [optionsMap.layoutParams.crop.cropOnlyFill]: cropOnlyFill,
  groupsPerStrip,
  [optionsMap.layoutParams.groups.numberOfGroupsPerRow]: groupsPerStrip,
  fixedColumns,
  [optionsMap.layoutParams.structure.numberOfColumns]: fixedColumns,
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
  [optionsMap.layoutParams.targetItemSize.unit]: gallerySizeType,
  gallerySize,
  gallerySizePx,
  gallerySizeRatio,
  [optionsMap.layoutParams.targetItemSize.value]:
    layoutParams_targetItemSize_value,
  allowContextMenu,
  [optionsMap.behaviourParams.gallery.blockContextMenu]: allowContextMenu,
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
  [optionsMap.layoutParams.structure.groupsOrder]: placeGroupsLtr,
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
  [optionsMap.layoutParams.structure.enableStreching]: useMaxDimensions,
  cubeFitPosition,
  [optionsMap.layoutParams.crop.alignment]: cubeFitPosition,
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
    behaviourParams_gallery_horizontal_autoSlide_behaviour,
  autoSlideshowContinuousSpeed,
  [optionsMap.behaviourParams.gallery.horizontal.autoSlide.speed]:
    behaviourParams_gallery_horizontal_autoSlide_speed,
  behaviourParams_item_content_magnificationValue,
  [optionsMap.behaviourParams.item.content.magnificationValue]:
    behaviourParams_item_content_magnificationValue,
  arrowsColor,
  [optionsMap.stylingParams.arrowsColor]: arrowsColor,
  [optionsMap.layoutParams.navigationArrows.type]:
    layoutParams_navigationArrows_type,
  [optionsMap.layoutParams.navigationArrows.container.type]:
    layoutParams_navigationArrows_container_type,
  [optionsMap.layoutParams.navigationArrows.container.backgroundColor]:
    layoutParams_navigationArrows_container_backgroundColor,
  [optionsMap.layoutParams.navigationArrows.container.borderRadius]:
    layoutParams_navigationArrows_container_borderRadius,
  [optionsMap.stylingParams.temResolutionMode]:
    stylingParams_itemResolutionMode,
};
// TODO = add the options:
/*
itemOpacity
imageLoadingColor
oneColorAnimationColor
*/
