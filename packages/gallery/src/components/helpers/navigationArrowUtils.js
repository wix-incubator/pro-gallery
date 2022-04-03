import React from 'react';
import { utils, GALLERY_CONSTS } from 'pro-gallery-lib';
import { ARROWS_DATA } from '../svgs';

const getArrowsSizeData = ({
  customNavArrowsRenderer,
  arrowsSize,
  svgData,
  containerStyleType,
}) => {
  const isLandscape = svgData.width / svgData.height > 1;
  if (containerStyleType === GALLERY_CONSTS.arrowsContainerStyleType.BOX) {
    const sizeData = {
      navArrowsContainerWidth: arrowsSize,
      navArrowsContainerHeight: arrowsSize,
      scalePercentage:
        arrowsSize / 2.4 / (isLandscape ? svgData.width : svgData.height),
    };
    return sizeData;
  }
  if (customNavArrowsRenderer) {
    return {
      navArrowsContainerWidth: arrowsSize,
      navArrowsContainerHeight: arrowsSize,
    };
  }

  const scalePercentage = arrowsSize / svgData.width;
  return {
    scalePercentage,
    navArrowsContainerWidth: arrowsSize,
    navArrowsContainerHeight: svgData.height * scalePercentage,
  };
};

export const getArrowsRenderData = (arrowsDataRelevantArgs) => {
  const {
    customNavArrowsRenderer,
    arrowsColor,
    arrowsSize,
    arrowsType,
    containerStyleType,
  } = arrowsDataRelevantArgs;
  const arrowData = getArrowIconData(arrowsType);
  const { navArrowsContainerWidth, navArrowsContainerHeight, scalePercentage } =
    getArrowsSizeData({
      customNavArrowsRenderer,
      arrowsSize,
      svgData: arrowData,
      containerStyleType,
    });
  if (customNavArrowsRenderer) {
    const size =
      containerStyleType === GALLERY_CONSTS.arrowsContainerStyleType.BOX
        ? arrowsSize / 2.4
        : arrowsSize;
    const customRenderer = (position) => (
      <div
        style={{
          width: size,
          height: size,
        }}
      >
        {customNavArrowsRenderer(position)}
      </div>
    );
    return {
      arrowRenderer: customRenderer,
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
  const arrowData = getArrowIconData(layoutParams.navigationArrows.type);
  const { navArrowsContainerHeight } = getArrowsSizeData({
    customNavArrowsRenderer,
    arrowsSize,
    svgData: arrowData,
    containerStyleType:
      layoutParams.navigationArrows.container.containerStyleType,
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

const getArrowIconData = (
  arrowType = GALLERY_CONSTS.arrowsType.DEFAULT_ARROW
) => {
  const {
    DEFAULT_ARROW,
    ARROW_2,
    ARROW_3,
    ARROW_4,
    ARROW_5,
    ARROW_6,
    ARROW_7,
  } = GALLERY_CONSTS.arrowsType;
  let arrowData;
  switch (arrowType) {
    case ARROW_2:
      arrowData = ARROWS_DATA.ARROW_2;
      break;
    case ARROW_3:
      arrowData = ARROWS_DATA.ARROW_3;
      break;
    case ARROW_4:
      arrowData = ARROWS_DATA.ARROW_4;
      break;
    case ARROW_5:
      arrowData = ARROWS_DATA.ARROW_5;
      break;
    case ARROW_6:
      arrowData = ARROWS_DATA.ARROW_6;
      break;
    case ARROW_7:
      arrowData = ARROWS_DATA.ARROW_7;
      break;
    case DEFAULT_ARROW:
    default:
      arrowData = ARROWS_DATA.DEFAULT_ARROW;
      break;
  }
  return arrowData;
};

export const getArrowBoxStyle = ({ type, backgroundColor, borderRadius }) => {
  return type === GALLERY_CONSTS.arrowsContainerStyleType.BOX
    ? {
        backgroundColor: backgroundColor,
        borderRadius: `${borderRadius}%`,
      }
    : {};
};
