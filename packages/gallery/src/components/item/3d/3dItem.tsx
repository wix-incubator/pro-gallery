import React from 'react';
import { ThreeDImplementation } from './types';
import { use3DItem } from './hooks';

export default function ThreeDItem(props: ThreeDImplementation): JSX.Element {
  const { canvasRef, isLoaded } = use3DItem(props);

  const canvas = (
    <canvas key={'canvas'} width={'100%'} height={'100%'} ref={canvasRef} />
  );

  if (!props.shouldPlay) {
    if (isLoaded) {
      return (
        <>
          {canvas}
          {props.hover}
        </>
      );
    }
    return props.placeholder;
  }
  return (
    <>
      {canvas}
      {!isLoaded && props.placeholder}
    </>
  );
}
