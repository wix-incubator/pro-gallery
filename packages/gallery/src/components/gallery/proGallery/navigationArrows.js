import React from 'react';
import * as ReactDOM from 'react-dom';
import { GALLERY_CONSTS, utils, optionsMap } from 'pro-gallery-lib';
import { ArrowFollower, MouseFollowerProvider } from '../../helpers/mouseCursorPosition.js';
import { getArrowBoxStyle, getArrowsRenderData } from '../../helpers/navigationArrowUtils.js';

export function NavigationArrows({
  options,
  hideLeftArrow,
  hideRightArrow,
  container,
  customNavArrowsRenderer,
  next,
  id,
}) {
  const itemSpacing = options[optionsMap.layoutParams.structure.itemSpacing];
  const isRTL =
    options[optionsMap.behaviourParams.gallery.layoutDirection] ===
    GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection].RIGHT_TO_LEFT;
  const arrowsPosition = options[optionsMap.layoutParams.navigationArrows.position];
  const arrowsPadding = options[optionsMap.layoutParams.navigationArrows.padding];
  const scrollDirection = options[optionsMap.layoutParams.structure.scrollDirection];
  const mouseCursorContainerMaxWidth = options[optionsMap.layoutParams.navigationArrows.mouseCursorContainerMaxWidth];

  const {
    arrowRenderer: renderArrowSvg,
    navArrowsContainerWidth,
    navArrowsContainerHeight,
  } = getArrowsRenderData({
    customNavArrowsRenderer,
    arrowsColor: options[optionsMap.stylingParams.arrowsColor], //v5 TODO - get this in the nav arrows options
    arrowsSize: options[optionsMap.layoutParams.navigationArrows.size],
    arrowsType: options[optionsMap.layoutParams.navigationArrows.type],
    containerStyleType: options[optionsMap.layoutParams.navigationArrows.container.type],
  });
  const mouseCursorEnabled =
    arrowsPosition === GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.position].MOUSE_CURSOR;

  const { galleryHeight } = container;
  const infoHeight = options[optionsMap.layoutParams.info.height];
  const imageHeight = galleryHeight - infoHeight;

  // the nav arrows parent container top edge is itemSpacing/2 ABOVE the actual view, that calculates the middle point of gallery
  const galleryVerticalCenter = `50% + ${itemSpacing / 4}px`;

  // Determines the direction fix, the direction in which we move the nav arrows 'vertical position fix' pixels
  let directionFix;
  if (GALLERY_CONSTS.hasExternalAbovePlacement(options[optionsMap.layoutParams.info.placement])) {
    directionFix = -1;
  } else if (GALLERY_CONSTS.hasExternalBelowPlacement(options[optionsMap.layoutParams.info.placement])) {
    directionFix = 1;
  } else {
    // if we got here, we should be ITEM_CENTER, taken care of in layoutHelper.ts
  }
  const verticalPositionFix = {
    [GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.verticalAlignment].ITEM_CENTER]: 0,
    [GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.verticalAlignment].IMAGE_CENTER]:
      infoHeight * directionFix,
    [GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.verticalAlignment].INFO_CENTER]:
      -imageHeight * directionFix,
  }[options[optionsMap.layoutParams.navigationArrows.verticalAlignment]];
  const arrowBoxStyle = getArrowBoxStyle({
    type: options[optionsMap.layoutParams.navigationArrows.container.type],
    backgroundColor: options[optionsMap.layoutParams.navigationArrows.container.backgroundColor],
    borderRadius: options[optionsMap.layoutParams.navigationArrows.container.borderRadius],
  });
  const containerStyle = mouseCursorEnabled
    ? {
        width: `${navArrowsContainerWidth}px`,
        height: `${navArrowsContainerHeight}px`,
        ...arrowBoxStyle,
      }
    : {
        width: `${navArrowsContainerWidth}px`,
        height: `${navArrowsContainerHeight}px`,
        padding: 0,
        top: `calc(${galleryVerticalCenter} - ${navArrowsContainerHeight / 2}px - 
        ${verticalPositionFix / 2}px)`,
        ...arrowBoxStyle,
      };

  const arrowsPos =
    scrollDirection === GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL &&
    arrowsPosition === GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.position].OUTSIDE_GALLERY
      ? `-${20 + navArrowsContainerWidth}px`
      : `${itemSpacing / 2 + (arrowsPadding ? arrowsPadding : 0)}px`;
  // itemSpacing effect the margin of the main div ('pro-gallery-parent-container') that SlideshowView is rendering, so the arrows should be places accordingly
  // arrowsPadding relevant only for arrowsPosition.ON_GALLERY

  const prevContainerStyle = { left: mouseCursorEnabled ? 0 : arrowsPos };
  const nextContainerStyle = { right: mouseCursorEnabled ? 0 : arrowsPos };

  const containerStylesByType = {
    BOX: 'box',
    SHADOW: 'shadow',
    NONE: 'only-arrows',
  };

  const containerStylingClass =
    containerStylesByType[options[optionsMap.layoutParams.navigationArrows.container.type]] || '';

  const arrowsBaseClasses = [
    'nav-arrows-container',
    containerStylingClass,
    utils.isMobile() ? ' pro-gallery-mobile-indicator' : '',
  ];
  const navigationArrowPortalId = `arrow-portal-container-${id}`;

  const ArrowRenderHandler = mouseCursorEnabled ? ArrowButtonWithCursorController : ArrowButton;
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

  const provideMouseFollower = (children) => {
    if (mouseCursorEnabled) {
      return <MouseFollowerProvider id={id}>{children}</MouseFollowerProvider>;
    }
    return children;
  };

  return (
    <ArrowsContainer
      hideLeftArrow={hideLeftArrow}
      hideRightArrow={hideRightArrow}
      mouseCursorEnabled={mouseCursorEnabled}
      isRTL={isRTL}
      navigationArrowPortalId={navigationArrowPortalId}
    >
      {provideMouseFollower(
        <>
          {hideLeftArrow ? null : renderArrow(true)}
          {hideRightArrow ? null : renderArrow(false)}
        </>
      )}
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
  return <button {...buttonProps}>{renderArrowSvg(directionIsLeft ? 'left' : 'right')}</button>;
}

export function ArrowButtonWithCursorController(props) {
  const {
    directionIsLeft,
    next,
    mouseCursorContainerMaxWidth,
    hideLeftArrow,
    hideRightArrow,
    renderArrowSvg,
    containerStyle,
    arrowsBaseClasses,
    navArrowsContainerWidth,
    navArrowsContainerHeight,
  } = props;
  const isTheOnlyArrow = hideLeftArrow || hideRightArrow;
  return (
    <ArrowFollower
      id={props.id}
      mouseCursorContainerMaxWidth={mouseCursorContainerMaxWidth}
      navArrowsContainerWidth={navArrowsContainerWidth}
      navArrowsContainerHeight={navArrowsContainerHeight}
      onNavigate={() => next({ direction: directionIsLeft ? -1 : 1 })}
      direction={directionIsLeft ? 'left' : 'right'}
      isTheOnlyArrow={isTheOnlyArrow}
    >
      {(x, y) => (
        <div
          style={{
            top: y,
            left: x,
          }}
          className="follow-mouse-cursor"
        >
          <div
            className={arrowsBaseClasses.join(' ')}
            style={{
              ...containerStyle,
              top: -navArrowsContainerHeight / 2,
              left: -navArrowsContainerWidth / 2,
            }}
          >
            {renderArrowSvg(directionIsLeft ? 'left' : 'right')}
          </div>
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
      justifyContent: hideLeftArrow ? 'flex-end' : hideRightArrow ? 'flex-start' : 'space-between',
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
  return React.Fragment ? <React.Fragment>{children}</React.Fragment> : <div>{children}</div>;
}
