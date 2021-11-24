import React from 'react';
import { utils, GALLERY_CONSTS } from 'pro-gallery-lib';
import {
  arrow1,
  arrow2,
  arrow3,
  arrow4,
  arrow5,
  arrow6,
  arrowDefault,
} from '../svgs';
const ARROWS_BASE_SIZE = {
  width: 23,
  height: 39,
};

const getArrowsSizeData = (customNavArrowsRenderer, arrowsSize) => {
  if (customNavArrowsRenderer) {
    return {
      navArrowsContainerWidth: arrowsSize,
      navArrowsContainerHeight: arrowsSize,
    };
  }
  const scalePercentage = arrowsSize / ARROWS_BASE_SIZE.width;
  const navArrowsContainerWidth = arrowsSize; // === ARROWS_BASE_SIZE.width * scalePercentage
  const navArrowsContainerHeight = ARROWS_BASE_SIZE.height * scalePercentage;
  return {
    navArrowsContainerWidth,
    navArrowsContainerHeight,
    scalePercentage,
  };
};

export const getArrowsRenderData = (arrowsDataRelevantArgs) => {
  const { customNavArrowsRenderer, arrowsColor, arrowsSize, arrowsType } =
    arrowsDataRelevantArgs;
  const { navArrowsContainerWidth, navArrowsContainerHeight, scalePercentage } =
    getArrowsSizeData(customNavArrowsRenderer, arrowsSize);
  if (customNavArrowsRenderer) {
    return {
      arrowRenderer: customNavArrowsRenderer,
      navArrowsContainerWidth,
      navArrowsContainerHeight,
    };
  }
  const svgInternalStyle =
    utils.isMobile() && arrowsColor?.value ? { fill: arrowsColor.value } : {};

  return {
    arrowRenderer: getArrowsRenderer({
      scalePercentage,
      svgInternalStyle,
      arrowsType,
    }),
    navArrowsContainerWidth,
    navArrowsContainerHeight,
  };
};

// Function that checks if the nav arrows parent-container is large enough for them
const arrowsWillFitPosition = (arrowsWillFitPositionRelevantArgs) => {
  const {
    slideshowInfoSize,
    arrowsVerticalPosition,
    textBoxHeight,
    arrowsSize,
  } = arrowsWillFitPositionRelevantArgs.options;
  const isSlideshow = GALLERY_CONSTS.isLayout('SLIDESHOW')(
    arrowsWillFitPositionRelevantArgs.options
  );
  const { height } = arrowsWillFitPositionRelevantArgs.container;
  const { customNavArrowsRenderer } = arrowsWillFitPositionRelevantArgs;
  // Calc of Nav arrows container's height
  const { navArrowsContainerHeight } = getArrowsSizeData(
    customNavArrowsRenderer,
    arrowsSize
  );
  const infoHeight = isSlideshow ? slideshowInfoSize : textBoxHeight;
  const parentHeightByVerticalPosition = {
    INFO_CENTER: infoHeight,
    IMAGE_CENTER: height - infoHeight,
    ITEM_CENTER: height,
  };
  const parentHeight = parentHeightByVerticalPosition[arrowsVerticalPosition];
  return parentHeight >= navArrowsContainerHeight;
};

// function to Determine whether we should render the navigation arrows
export const shouldRenderNavArrows = (props) => {
  const shouldRenderArrowsRelevantArgs = getShouldRenderArrowsArgs(props);
  const { showArrows } = shouldRenderArrowsRelevantArgs.options;

  const { galleryWidth } = shouldRenderArrowsRelevantArgs.container;
  const { isPrerenderMode, galleryStructure, customNavArrowsRenderer } =
    shouldRenderArrowsRelevantArgs;
  const arrowsWillFitPositionRelevantArgs = {
    options: shouldRenderArrowsRelevantArgs.options,
    container: shouldRenderArrowsRelevantArgs.container,
    customNavArrowsRenderer,
  };
  const isGalleryWiderThanRenderedItems =
    galleryStructure.width <= galleryWidth;
  return (
    !!showArrows &&
    !isPrerenderMode &&
    arrowsWillFitPosition(arrowsWillFitPositionRelevantArgs) &&
    !isGalleryWiderThanRenderedItems
  );
};

const getShouldRenderArrowsArgs = (props) => {
  const { isPrerenderMode, galleryStructure, customNavArrowsRenderer } = props;
  return {
    options: props.options,
    container: props.container,
    isPrerenderMode,
    galleryStructure,
    customNavArrowsRenderer,
  };
};

const getArrowsRenderer = ({
  scalePercentage,
  svgInternalStyle,
  arrowsType,
}) => {
  let ArrowComp;
  switch (arrowsType) {
    case 1:
      ArrowComp = arrow1;
      break;
    case 2:
      ArrowComp = arrow2;
      break;
    case 3:
      ArrowComp = arrow3;
      break;
    case 4:
      ArrowComp = arrow4;
      break;
    case 5:
      ArrowComp = arrow5;
      break;
    case 6:
      ArrowComp = arrow6;
      break;
    default:
      ArrowComp = arrowDefault;
      break;
  }
  return (position) => {
    const scaleX = position === 'right' ? 1 : -1;
    const svgStyle = {
      transform: `scale(${scalePercentage}) scaleX(${scaleX})`,
    };
    return (
      <ArrowComp svgStyle={svgStyle} svgInternalStyle={svgInternalStyle} />
    );
  };
};
