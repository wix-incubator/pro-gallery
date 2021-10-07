import React from 'react';
import { utils, GALLERY_CONSTS } from 'pro-gallery-lib';
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
  const { customNavArrowsRenderer, arrowsColor, arrowsSize } =
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
  const svgStyle = { transform: `scale(${scalePercentage})` };
  const svgInternalStyle =
    utils.isMobile() && arrowsColor?.value ? { fill: arrowsColor.value } : {};

  const arrowRenderer = (position) => {
    const { d, transform } =
      position === 'right'
        ? {
            d: 'M857.005,231.479L858.5,230l18.124,18-18.127,18-1.49-1.48L873.638,248Z',
            transform: 'translate(-855 -230)',
          }
        : {
            d: 'M154.994,259.522L153.477,261l-18.471-18,18.473-18,1.519,1.48L138.044,243Z',
            transform: 'translate(-133 -225)',
          };
    return (
      <svg
        width={ARROWS_BASE_SIZE.width}
        height={ARROWS_BASE_SIZE.height}
        viewBox={`0 0 ${ARROWS_BASE_SIZE.width} ${ARROWS_BASE_SIZE.height}`}
        style={svgStyle}
      >
        <path
          className="slideshow-arrow"
          style={svgInternalStyle}
          d={d}
          transform={transform}
        />
      </svg>
    );
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
