import React from 'react';
import { CursorController } from './mouseCursorPosition';

export function renderCursorController({
  arrowRenderer,
  next,
  directionIsLeft,
  arrowsBaseClasses,
  containerStyle,
  prevContainerStyle,
  nextContainerStyle,
  isRTL,
  tabIndex,
}) {
  return (
    <CursorController>
      {
        ({ containerRef, mouseRef, position, isMouseDown }) =>
          reuseButton({
            containerRef,
            mouseRef,
            position,
            isMouseDown,
            arrowsBaseClasses,
            containerStyle,
            prevContainerStyle,
            nextContainerStyle,
            isRTL,
            directionIsLeft,
            arrowRenderer,
            next,
            tabIndex,
          })
        // <button
        //     ref={containerRef}
        //     className={arrowsBaseClasses.join(' ')}
        //     onClick={() => next({ direction: directionIsLeft ? -1 : 1 })}
        //     aria-label={`${(directionIsLeft && isRTL) || (!directionIsLeft && !isRTL)
        //         ? 'Next'
        //         : 'Previous'
        //         } Item`}
        //     tabIndex={tabIndex(
        //         directionIsLeft ? 'slideshowPrev' : 'slideshowNext'
        //     )}
        //     key="nav-arrow-back"
        //     data-hook="nav-arrow-back"
        //     style={{
        //         ...containerStyle,
        //         ...(directionIsLeft ? prevContainerStyle : nextContainerStyle),
        //     }}
        // >
        //     {isMouseDown && (
        //         <span ref={mouseRef} style={{ top: position.y, left: position.x }}>
        //             {arrowRenderer(directionIsLeft ? 'left' : 'right')}
        //         </span>
        //     )}
        // </button>
      }
    </CursorController>
  );
}

function reuseButton({
  containerRef,
  mouseRef,
  position,
  isMouseDown,
  arrowsBaseClasses,
  containerStyle,
  prevContainerStyle,
  nextContainerStyle,
  isRTL,
  directionIsLeft,
  arrowRenderer,
  next,
  tabIndex,
}) {
  return (
    <button
      ref={containerRef}
      className={arrowsBaseClasses.join(' ')}
      onClick={() => next({ direction: directionIsLeft ? -1 : 1 })}
      aria-label={`${
        (directionIsLeft && isRTL) || (!directionIsLeft && !isRTL)
          ? 'Next'
          : 'Previous'
      } Item`}
      tabIndex={tabIndex(directionIsLeft ? 'slideshowPrev' : 'slideshowNext')}
      key="nav-arrow-back"
      data-hook="nav-arrow-back"
      style={{
        ...containerStyle,
        ...(directionIsLeft ? prevContainerStyle : nextContainerStyle),
      }}
    >
      {isMouseDown && (
        <span ref={mouseRef} style={{ top: position.y, left: position.x }}>
          {arrowRenderer(directionIsLeft ? 'left' : 'right')}
        </span>
      )}
    </button>
  );
}
