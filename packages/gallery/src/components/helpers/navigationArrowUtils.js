import React from 'react';
import { utils, GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { ARROWS_DATA } from '../svgs';

const getArrowsSizeData = ({ customNavArrowsRenderer, arrowsSize, svgData, containerStyleType }) => {
  const isLandscape = svgData.width / svgData.height > 1;
  if (containerStyleType === GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.container.type].BOX) {
    const sizeData = {
      navArrowsContainerWidth: arrowsSize,
      navArrowsContainerHeight: arrowsSize,
      scalePercentage: arrowsSize / 2.4 / (isLandscape ? svgData.width : svgData.height),
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

export const getArrowsRenderData = ({
  customNavArrowsRenderer,
  arrowsColor,
  arrowsSize,
  arrowsType,
  containerStyleType,
}) => {
  const arrowData = getArrowIconData(arrowsType);
  const { navArrowsContainerWidth, navArrowsContainerHeight, scalePercentage } = getArrowsSizeData({
    customNavArrowsRenderer,
    arrowsSize,
    svgData: arrowData,
    containerStyleType,
  });
  if (customNavArrowsRenderer) {
    const size =
      containerStyleType === GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.container.type].BOX
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
const arrowsWillFitPosition = ({ options, container, customNavArrowsRenderer }) => {
  const { height } = container;
  // Calc of Nav arrows container's height
  const arrowData = getArrowIconData(options[optionsMap.layoutParams.navigationArrows.type]);
  const { navArrowsContainerHeight } = getArrowsSizeData({
    customNavArrowsRenderer,
    arrowsSize: options[optionsMap.layoutParams.navigationArrows.size],
    svgData: arrowData,
    containerStyleType: options[optionsMap.layoutParams.navigationArrows.container.type],
  });
  const infoHeight = options[optionsMap.layoutParams.info.height];
  const parentHeightByVerticalPosition = {
    [GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.verticalAlignment].INFO_CENTER]: infoHeight,
    [GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.verticalAlignment].IMAGE_CENTER]: height - infoHeight,
    [GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.verticalAlignment].ITEM_CENTER]: height,
  };
  const parentHeight =
    parentHeightByVerticalPosition[options[optionsMap.layoutParams.navigationArrows.verticalAlignment]];
  return parentHeight >= navArrowsContainerHeight;
};

// function to Determine whether we should render the navigation arrows
export const shouldRenderNavArrows = (props) => {
  const shouldRenderArrowsRelevantArgs = getShouldRenderArrowsArgs(props);
  const navigationArrowsEnabled =
    shouldRenderArrowsRelevantArgs.options[optionsMap.layoutParams.navigationArrows.enable];

  const { galleryWidth } = shouldRenderArrowsRelevantArgs.container;
  const { isPrerenderMode, galleryStructure, customNavArrowsRenderer } = shouldRenderArrowsRelevantArgs;
  const arrowsWillFitPositionRelevantArgs = {
    options: shouldRenderArrowsRelevantArgs.options,
    container: shouldRenderArrowsRelevantArgs.container,
    customNavArrowsRenderer,
  };
  const isGalleryWiderThanRenderedItems = galleryStructure.width <= galleryWidth;
  return (
    !!navigationArrowsEnabled &&
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

const getArrowIconData = (arrowType = GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.type].DEFAULT_ARROW) => {
  const { DEFAULT_ARROW, ARROW_2, ARROW_3, ARROW_4, ARROW_5, ARROW_6, ARROW_7 } =
    GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.type];
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
  return type === GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.container.type].BOX
    ? {
        backgroundColor: backgroundColor,
        borderRadius: `${borderRadius}%`,
      }
    : {};
};
