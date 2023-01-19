import React from 'react';
import { ThreeDImplementation } from './types';
import { use3DItem } from './hooks';
import { VideoPlayButton } from '../media/playButton';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

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

  return (
    <>
      {canvas}
      {props.thumbnailWithOverride({
        extraClasses: [
          props.placeholderExtraClasses,
          isLoaded ? 'three-d-loaded' : 'three-d-loading',
        ].join(' '),
        overlay: !props.shouldPlay && (
          <VideoPlayButton
            onMouseDown={(e) => {
              e.stopPropagation();
              props.actions.eventsListener(
                GALLERY_CONSTS.events.THREE_D_CLICK,
                { idx: props.idx, id: props.id },
                props.idx
              );
            }}
          />
        ),
      })}
      {props.hover}
    </>
  );
}
