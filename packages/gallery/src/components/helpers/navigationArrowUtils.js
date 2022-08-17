import React from 'react';
import { utils, GALLERY_CONSTS } from 'pro-gallery-lib';
import { ARROWS_DATA } from '../svgs';
import {
  ArrowsContainer,
  renderArrowButtonWithCursorController,
} from './renderCursorController';

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
  const { arrowsVerticalPosition, textBoxHeight, arrowsSize, layoutParams } =
    arrowsWillFitPositionRelevantArgs.options;
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
  const infoHeight = textBoxHeight;
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

export function CreateArrows({
  options,
  hideLeftArrow,
  hideRightArrow,
  container,
  customNavArrowsRenderer,
  next,
}) {
  const {
    isRTL,
    scrollDirection,
    imageMargin,
    arrowsPadding,
    arrowsPosition,
    arrowsVerticalPosition,
    layoutParams,
    titlePlacement,
    textBoxHeight,
    arrowsColor,
    arrowsSize,
  } = options;
  const {
    container: { type, backgroundColor, borderRadius },
    mouseCursorContainerMaxWidth,
  } = layoutParams.navigationArrows;

  const {
    arrowRenderer: renderArrowSvg,
    navArrowsContainerWidth,
    navArrowsContainerHeight,
  } = getArrowsRenderData({
    customNavArrowsRenderer,
    arrowsColor: arrowsColor,
    arrowsSize: arrowsSize,
    arrowsType: layoutParams.navigationArrows.type,
    containerStyleType: type,
  });
  const mouseCursorEnabled =
    arrowsPosition === GALLERY_CONSTS.arrowsPosition.MOUSE_CURSOR;

  const { galleryHeight } = container;
  const { galleryWidth } = container;
  const infoHeight = textBoxHeight;
  const imageHeight = galleryHeight - infoHeight;

  // the nav arrows parent container top edge is imageMargin/2 ABOVE the actual view, that calculates the middle point of gallery
  const galleryVerticalCenter = `50% + ${imageMargin / 4}px`;

  // Determines the direction fix, the direction in which we move the nav arrows 'vertical position fix' pixels
  let directionFix;
  if (GALLERY_CONSTS.hasExternalAbovePlacement(titlePlacement)) {
    directionFix = -1;
  } else if (GALLERY_CONSTS.hasExternalBelowPlacement(titlePlacement)) {
    directionFix = 1;
  } else {
    // if we got here, we should be ITEM_CENTER, taken care of in layoutHelper.js
  }
  const verticalPositionFix = {
    [GALLERY_CONSTS.arrowsVerticalPosition.ITEM_CENTER]: 0,
    [GALLERY_CONSTS.arrowsVerticalPosition.IMAGE_CENTER]:
      infoHeight * directionFix,
    [GALLERY_CONSTS.arrowsVerticalPosition.INFO_CENTER]:
      -imageHeight * directionFix,
  }[arrowsVerticalPosition];
  const arrowBoxStyle = getArrowBoxStyle({
    type,
    backgroundColor,
    borderRadius,
  });
  const containerStyle = mouseCursorEnabled
    ? {
        width: `${galleryWidth}px`,
        maxWidth: `${mouseCursorContainerMaxWidth}%`,
        height: `${galleryHeight}px`,
        padding: 0,
        top: 0,
        flex: 1,
      }
    : {
        width: `${navArrowsContainerWidth}px`,
        height: `${navArrowsContainerHeight}px`,
        padding: 0,
        top: `calc(${galleryVerticalCenter} - ${
          navArrowsContainerHeight / 2
        }px - 
      ${verticalPositionFix / 2}px)`,
        ...arrowBoxStyle,
      };

  const arrowsPos =
    scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
    arrowsPosition === GALLERY_CONSTS.arrowsPosition.OUTSIDE_GALLERY
      ? `-${20 + navArrowsContainerWidth}px`
      : `${imageMargin / 2 + (arrowsPadding ? arrowsPadding : 0)}px`;
  // imageMargin effect the margin of the main div ('pro-gallery-parent-container') that SlideshowView is rendering, so the arrows should be places accordingly
  // arrowsPadding relevant only for arrowsPosition.ON_GALLERY

  const prevContainerStyle = { left: mouseCursorEnabled ? 0 : arrowsPos };
  const nextContainerStyle = { right: mouseCursorEnabled ? 0 : arrowsPos };

  const useDropShadow = type === GALLERY_CONSTS.arrowsContainerStyleType.SHADOW;
  const arrowsBaseClasses = [
    'nav-arrows-container',
    useDropShadow ? 'drop-shadow' : '',
    utils.isMobile() ? ' pro-gallery-mobile-indicator' : '',
    mouseCursorEnabled ? 'follow-mouse-cursor' : '',
  ];

  const ArrowRenderHandler = mouseCursorEnabled
    ? renderArrowButtonWithCursorController
    : renderArrowButton;
  const renderArrow = (directionIsLeft) => {
    return (
      <ArrowRenderHandler
        {...{
          renderArrowSvg,
          next,
          directionIsLeft,
          arrowsBaseClasses,
          tabIndex: utils.getTabIndex.bind(utils),
          containerStyle,
          prevContainerStyle,
          nextContainerStyle,
          isRTL,
          hideLeftArrow,
          arrowBoxStyle,
          navArrowsContainerWidth,
          navArrowsContainerHeight,
        }}
      />
    );
  };

  return (
    <ArrowsContainer
      hideLeftArrow={hideLeftArrow}
      hideRightArrow={hideRightArrow}
      mouseCursorEnabled={mouseCursorEnabled}
    >
      {hideLeftArrow ? null : renderArrow(true)}
      {hideRightArrow ? null : renderArrow(false)}
    </ArrowsContainer>
  );
}

export function renderArrowButton({
  cursor,
  arrowsBaseClasses,
  containerStyle,
  prevContainerStyle,
  nextContainerStyle,
  isRTL,
  directionIsLeft,
  renderArrowSvg,
  next,
  tabIndex,
  styleArrowBox,
  navArrowsContainerWidth,
  navArrowsContainerHeight,
}) {
  const isNext = (directionIsLeft && isRTL) || (!directionIsLeft && !isRTL);

  const buttonProps = {
    className: arrowsBaseClasses.join(' '),
    onClick: () => next({ direction: directionIsLeft ? -1 : 1 }),
    ['aria-label']: `${isNext ? 'Next' : 'Previous'} Item`,
    tabIndex: tabIndex(isNext ? 'slideshowNext' : 'slideshowPrev'),
    key: !isNext ? 'nav-arrow-back' : 'nav-arrow-next',
    ['data-hook']: directionIsLeft ? 'nav-arrow-back' : 'nav-arrow-next',
    style: {
      ...containerStyle,
      ...(directionIsLeft ? prevContainerStyle : nextContainerStyle),
    },
  };
  if (cursor) {
    const { containerRef, isMouseEnter, position } = cursor;
    return (
      <button ref={(ref) => (containerRef.current = ref)} {...buttonProps}>
        {isMouseEnter && (
          <span
            style={{
              top: position.y,
              left: position.x,
              ...styleArrowBox,
              width: navArrowsContainerWidth,
              height: navArrowsContainerHeight,
            }}
          >
            {renderArrowSvg(directionIsLeft ? 'left' : 'right')}
          </span>
        )}
      </button>
    );
  }
  return (
    <button {...buttonProps}>
      {renderArrowSvg(directionIsLeft ? 'left' : 'right')}
    </button>
  );
}
