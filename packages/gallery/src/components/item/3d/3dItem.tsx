import React from 'react';
import ImageItem from '../imageItem';
import { ThreeDProps } from './types';
import { use3DItem } from './hooks';

class ImageItemExtendable extends ImageItem {
  declare props: ImageItem['props'] & {
    children: (self: ImageItem) => JSX.Element;
  };
  render() {
    return this.props.children(this);
  }
}

export default function ThreeDItem(props: ThreeDProps): JSX.Element {
  const { canvasRef, containerRef, viewMode, trigger3D } = use3DItem(props);

  return (
    <ImageItemExtendable
      {...props}
      onMouseDown={trigger3D}
      onTouchStart={(e) => {
        props.actions.handleItemMouseDown(e);
        trigger3D();
      }}
    >
      {(self) => {
        const canvas = (
          <canvas width={'100%'} height={'100%'} ref={canvasRef} />
        );

        const imageRenderer = viewMode === 'image' && self.imageElement;
        const imageContainerClassNames = self.containerClassNames;
        const animationOverlay = self.animationOverlay;

        const props: React.HTMLAttributes<HTMLDivElement> &
          React.ClassAttributes<HTMLDivElement> = {
          onMouseDown: trigger3D,
          onTouchStart: (e) => {
            self.props.actions.handleItemMouseDown(e);
            trigger3D();
          },
          ref: containerRef,
        };
        return self.getImageContainer(
          imageRenderer,
          imageContainerClassNames,
          <>
            {animationOverlay}
            {canvas}
          </>,
          props
        );
      }}
    </ImageItemExtendable>
  );
}
