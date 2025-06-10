import React from 'react';
import * as ReactDOM from 'react-dom';
import { GALLERY_CONSTS, utils } from 'pro-gallery-lib';
import { ArrowFollower } from '../../helpers/mouseCursorPosition';
import {
  getArrowBoxStyle,
  getArrowsRenderData,
} from '../../helpers/navigationArrowUtils';

export function NavigationArrows({
  options,
  hideLeftArrow,
  hideRightArrow,
  container,
  customNavArrowsRenderer,
  next,
  id,
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
    // if we got here, we should be ITEM_CENTER, taken care of in layoutHelper.ts
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
  const navigationArrowPortalId = `arrow-portal-container-${id}`;

  const ArrowRenderHandler = mouseCursorEnabled
    ? ArrowButtonWithCursorController
    : ArrowButton;
  const renderArrow = (directionIsLeft) => {
    return (
      <ArrowRenderHandler
        {...{
          renderArrowSvg,
          next,
          directionIsLeft,
          arrowsBaseClasses,
          containerStyle,
          prevContainerStyle,
          nextContainerStyle,
          isRTL,
          hideLeftArrow,
          hideRightArrow,
          arrowBoxStyle,
          navArrowsContainerWidth,
          navArrowsContainerHeight,
          navigationArrowPortalId,
          mouseCursorContainerMaxWidth,
          id,
        }}
      />
    );
  };

  return (
    <ArrowsContainer
      hideLeftArrow={hideLeftArrow}
      hideRightArrow={hideRightArrow}
      mouseCursorEnabled={mouseCursorEnabled}
      isRTL={isRTL}
      navigationArrowPortalId={navigationArrowPortalId}
    >
      {hideLeftArrow ? null : renderArrow(true)}
      {hideRightArrow ? null : renderArrow(false)}
    </ArrowsContainer>
  );
}

export function ArrowButton({
  cursor,
  arrowsBaseClasses,
  containerStyle,
  prevContainerStyle,
  nextContainerStyle,
  isRTL,
  directionIsLeft,
  renderArrowSvg,
  next,
  arrowBoxStyle,
  navArrowsContainerWidth,
  navArrowsContainerHeight,
  navigationArrowPortalId,
}) {
  const isNext = (directionIsLeft && isRTL) || (!directionIsLeft && !isRTL);
  const nextAction = () => next({ direction: directionIsLeft ? -1 : 1 });
  const buttonProps = {
    className: arrowsBaseClasses.join(' '),
    onClick: () => setTimeout(nextAction, 0),
    ['aria-label']: `${isNext ? 'Next' : 'Previous'} Item`,
    tabIndex: '0',
    key: !isNext ? 'nav-arrow-back' : 'nav-arrow-next',
    ['data-hook']: !isNext ? 'nav-arrow-back' : 'nav-arrow-next',
    style: {
      ...containerStyle,
      ...(directionIsLeft ? prevContainerStyle : nextContainerStyle),
    },
  };
  if (cursor) {
    const { containerRef, isMouseEnter, position } = cursor;
    return (
      <button ref={(ref) => (containerRef.current = ref)} {...buttonProps}>
        {isMouseEnter &&
          ReactDOM.createPortal(
            <span
              style={{
                top: position.y - navArrowsContainerHeight / 2,
                left: position.x - navArrowsContainerWidth / 2,
                ...arrowBoxStyle,
                width: navArrowsContainerWidth,
                height: navArrowsContainerHeight,
              }}
            >
              {renderArrowSvg(directionIsLeft ? 'left' : 'right')}
            </span>,
            window.document.getElementById(navigationArrowPortalId)
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

export function ArrowButtonWithCursorController(props) {
  const {
    directionIsLeft,
    next,
    mouseCursorContainerMaxWidth,
    hideLeftArrow,
    hideRightArrow,
    renderArrowSvg,
  } = props;
  const isTheOnlyArrow = hideLeftArrow || hideRightArrow;
  const nextAction = () => next({ direction: directionIsLeft ? -1 : 1 });
  return (
    <ArrowFollower
      id={props.id}
      mouseCursorContainerMaxWidth={mouseCursorContainerMaxWidth}
      onNavigate={nextAction}
      direction={directionIsLeft ? 'left' : 'right'}
      isTheOnlyArrow={isTheOnlyArrow}
    >
      {(x, y) => (
        <div
          style={{
            position: 'absolute',
            top: y,
            left: x,
            transition: 'all 0.2s ease',
            pointerEvents: 'none',
          }}
        >
          {renderArrowSvg(directionIsLeft ? 'left' : 'right')}
        </div>
      )}
    </ArrowFollower>
  );
}

export function ArrowsContainer({
  hideRightArrow,
  hideLeftArrow,
  mouseCursorEnabled,
  isRTL,
  children,
  navigationArrowPortalId,
}) {
  if (mouseCursorEnabled) {
    const styleForMouseCursor = {
      justifyContent: hideLeftArrow
        ? 'flex-end'
        : hideRightArrow
        ? 'flex-start'
        : 'space-between',
      flexDirection: isRTL ? 'row-reverse' : 'row',
    };
    return (
      <div className="mouse-cursor" style={{ ...styleForMouseCursor }}>
        <div id={navigationArrowPortalId} className="arrow-portal-container" />
        {/* navigationArrowPortalId must be the first element to make sure the mouseCursor events work properly */}
        {children}
      </div>
    );
  }
  return React.Fragment ? (
    <React.Fragment>{children}</React.Fragment>
  ) : (
    <div>{children}</div>
  );
}
