import React from 'react';
import { utils, GALLERY_CONSTS } from 'pro-gallery-lib';
import { ARROWS_DATA } from '../svgs';

const getArrowsSizeData = ({
  customNavArrowsRenderer,
  arrowsSize,
  svgData,
  containerStyleType,
}) => {
  if (containerStyleType === GALLERY_CONSTS.arrowsContainerStyleType.BOX) {
    const sizeData = {
      navArrowsContainerWidth: arrowsSize,
      navArrowsContainerHeight: arrowsSize,
    };
    if (svgData) {
      sizeData.scalePercentage = arrowsSize / 4 / svgData.width;
    }
    return sizeData;
  }
  if (customNavArrowsRenderer) {
    return {
      navArrowsContainerWidth: arrowsSize,
      navArrowsContainerHeight: arrowsSize,
    };
  }
  const isLandscape = svgData.width / svgData.height > 1;
  const scalePercentage = isLandscape
    ? arrowsSize / svgData.height
    : arrowsSize / svgData.width;
  const navArrowsContainerWidth = isLandscape
    ? svgData.width * scalePercentage
    : arrowsSize;
  const navArrowsContainerHeight = isLandscape
    ? arrowsSize
    : svgData.height * scalePercentage;
  return {
    navArrowsContainerWidth,
    navArrowsContainerHeight,
    scalePercentage,
  };
};

export const getArrowsRenderData = (arrowsDataRelevantArgs) => {
  const {
    customNavArrowsRenderer,
    arrowsColor,
    arrowsSize,
    containerStyleType,
  } = arrowsDataRelevantArgs;
  const arrowData = getArrowIconData();
  const { navArrowsContainerWidth, navArrowsContainerHeight, scalePercentage } =
    getArrowsSizeData({
      customNavArrowsRenderer,
      arrowsSize,
      svgData: arrowData,
      containerStyleType,
    });
  if (customNavArrowsRenderer) {
    return {
      arrowRenderer: customNavArrowsRenderer,
      navArrowsContainerWidth,
      navArrowsContainerHeight,
    };
  }
  const arrowRenderer = (position) => {
    const scaleX = position === 'right' ? 1 : -1;
    const style = {
      transform: `scaleX(${scaleX}) scale(${scalePercentage})`,
      fill: utils.isMobile() && arrowsColor?.value ? arrowsColor.value : '',
    };
    return <arrowData.SvgComp style={style} />;
  };
  return { arrowRenderer, navArrowsContainerWidth, navArrowsContainerHeight };
};

// Function that checks if the nav arrows parent-container is large enough for them
const arrowsWillFitPosition = (arrowsWillFitPositionRelevantArgs) => {
  const {
    slideshowInfoSize,
    arrowsVerticalPosition,
    textBoxHeight,
    arrowsSize,
    layoutParams,
  } = arrowsWillFitPositionRelevantArgs.options;
  const isSlideshow = GALLERY_CONSTS.isLayout('SLIDESHOW')(
    arrowsWillFitPositionRelevantArgs.options
  );
  const { height } = arrowsWillFitPositionRelevantArgs.container;
  const { customNavArrowsRenderer } = arrowsWillFitPositionRelevantArgs;
  // Calc of Nav arrows container's height
  const arrowData = getArrowIconData();
  const { navArrowsContainerHeight } = getArrowsSizeData({
    customNavArrowsRenderer,
    arrowsSize,
    svgData: arrowData,
    containerStyleType: layoutParams.navigationArrows.containerStyleType,
  });
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

const getArrowIconData = (arrowType = 0) => {
  let arrowData;
  switch (arrowType) {
    case 0:
    default:
      arrowData = ARROWS_DATA.DEFAULT_ARROW;
      break;
  }
  return arrowData;
};

export const getArrowBoxStyle = ({
  containerBackgroundColor,
  containerBorderRadius,
  containerStyleType,
}) => {
  return containerStyleType === GALLERY_CONSTS.arrowsContainerStyleType.BOX
    ? {
        backgroundColor: containerBackgroundColor,
        borderRadius: containerBorderRadius,
      }
    : {};
};
