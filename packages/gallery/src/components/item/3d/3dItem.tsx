import React from 'react';
import { ThreeDImplementation } from './types';
import { use3DItem } from './hooks';

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
      <span style={{ opacity: isLoaded ? 0 : 1, transition: 'opacity 200ms' }}>
        {props.thumbnail}
      </span>
      {props.hover}
    </>
  );
}
