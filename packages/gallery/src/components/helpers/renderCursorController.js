import React from 'react';
import { CursorController } from './mouseCursorPosition';
import { renderArrowButton } from './navigationArrowUtils';

export function ArrowsContainer({
  hideRightArrow,
  hideLeftArrow,
  mouseCursorEnabled,
  children,
}) {
  if (mouseCursorEnabled) {
    const styleForMouseCursor = {
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
