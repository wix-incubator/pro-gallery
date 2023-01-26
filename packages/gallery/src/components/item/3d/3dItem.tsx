import React, { useEffect } from 'react';
import { ThreeDImplementation } from './types';
import { use3DItem } from './hooks';
import { VideoPlayButton } from '../media/playButton';

export default function ThreeDItem(props: ThreeDImplementation): JSX.Element {
  const { canvasRef, isLoaded } = use3DItem(props);

  const canvas = (
    <canvas
      key={'canvas'}
      width={'100%'}
      height={'100%'}
      ref={canvasRef}
      style={{
        background: 'transparent',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 200ms',
      }}
    />
  );

  useOrbitControlsClickPropagation(props);

  return (
    <>
      {canvas}
      {props.thumbnailWithOverride({
        extraClasses: [
          props.placeholderExtraClasses,
          isLoaded ? 'three-d-loaded' : 'three-d-loading',
        ].join(' '),
        overlay: !props.shouldPlay && <VideoPlayButton />,
      })}
      {props.hover}
    </>
  );
}
function useOrbitControlsClickPropagation(props: ThreeDImplementation) {
  useEffect(() => {
    const container = props.itemContainer.current;
    if (!props.shouldPlay && container) {
      const onMouseDown = (e: MouseEvent) => {
        e.stopImmediatePropagation();
        const itemWrapper = container.querySelector<HTMLDivElement>(
          '.gallery-item-wrapper'
        );
        if (itemWrapper) {
          itemWrapper.click();
        }
      };
      container.addEventListener('mousedown', onMouseDown);
      return () => container.removeEventListener('mousedown', onMouseDown);
    }
    return;
  }, [props.shouldPlay]);
}
