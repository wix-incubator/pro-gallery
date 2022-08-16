import React from 'react';
import { CursorController } from './mouseCursorPosition';

export function ArrowsContainer({
  hideRightArrow,
  hideLeftArrow,
  mouseCursorEnabled,
  children,
}) {
  if (mouseCursorEnabled) {
    const styleForMouseCursor = {
      display: 'flex',
      width: '100%',
      position: 'absolute',
      justifyContent: hideLeftArrow
        ? 'flex-end'
        : hideRightArrow
        ? 'flex-start'
        : 'space-between',
    };
    return (
      <div className="mouse-cursor" style={{ ...styleForMouseCursor }}>
        {children}
      </div>
    );
  }
  return <>{children}</>;
}

export function renderArrowButtonWithCursorController(props) {
  return (
    <CursorController>
      {({ containerRef, position, isMouseEnter }) =>
        renderArrowButton({
          cursor: {
            containerRef,
            position,
            isMouseEnter,
          },
          ...props,
        })
      }
    </CursorController>
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
    const { containerRef, isMouseEnter, mouseRef, position } = cursor;
    return (
      <button ref={containerRef} {...buttonProps}>
        {isMouseEnter && (
          <span
            ref={mouseRef}
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
