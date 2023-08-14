import { useState } from 'react';
import React from 'react';
const calcCropParams = ({ maxWidth, maxHeight, requiredWidth, requiredHeight, focalPoint }) => {
  let scale;
  let x;
  let y;
  let orgW;
  let orgH;
  const requiredRatio = requiredWidth / requiredHeight;
  const itemRatio = maxWidth / maxHeight;
  // find the scale
  if (itemRatio > requiredRatio) {
    // the original is wider than the required ratio
    scale = requiredHeight / maxHeight;
    orgW = Math.floor(requiredHeight * itemRatio);
    y = 0;
    x = Math.round(orgW * focalPoint[0] - requiredWidth / 2);
    x = Math.min(orgW - requiredWidth, x);
    x = Math.max(0, x);
  } else {
    // the original is narrower than the required ratio
    scale = requiredWidth / maxWidth;
    orgH = Math.floor(requiredWidth / itemRatio);
    x = 0;
    y = Math.round(orgH * focalPoint[1] - requiredHeight / 2);
    y = Math.min(orgH - requiredHeight, y);
    y = Math.max(0, y);
  }

  // make sure scale is not lower than needed
  // scale must be higher to prevent cases that there will be white margins (or 404)
  scale = Math.ceil(scale * 100) / 100;
  return { x, y, scale };
};
const getImageAdjustments = ({ maxWidth, maxHeight, width, height, focalPointForItem }) => {
  const originalImage = {
    width: maxWidth,
    height: maxHeight,
  };
  const newImage = {
    width,
    height,
  };

  const originalWidth = originalImage.width;
  const originalHeight = originalImage.height;

  const newWidth = newImage.width;
  const newHeight = newImage.height;

  const { x, y, scale } = calcCropParams({
    maxWidth: originalWidth,
    maxHeight: originalHeight,
    requiredWidth: newWidth,
    requiredHeight: newHeight,
    focalPoint: focalPointForItem,
  });

  return { focalFixX: x, focalFixY: y, scale };
};
const ImageWrapperHOC = (items) => (WrappedComponent) => {
  return (props): React.JSX.Element => {
    const [activeTooltip, setActiveTooltip] = useState(-1);
    const item = items[props['data-idx']];
    const focalPointForItem = item?.metadata?.focalPoint;
    const { itemWrapperProps, ...restProps } = props;

    if (itemWrapperProps) {
      const { maxWidth, maxHeight, width, height } = itemWrapperProps.style;
      const { focalFixX, focalFixY, scale } = getImageAdjustments({
        maxWidth,
        maxHeight,
        width,
        height,
        focalPointForItem,
      });

      const pois = item?.pois;
      const PinOnCroppedImage = (poi, index) => {
        const { x, y } = poi;
        const posX = maxWidth * x;
        const posY = maxHeight * y;
        const adjustedPinX = scale * posX - focalFixX;
        const adjustedPinY = scale * posY - focalFixY;
        return (
          <div className="poi poi-wrapper" style={{ left: adjustedPinX, top: adjustedPinY }}>
            <div
              className={`poi poi-point ${activeTooltip === index ? 'active' : ''}`}
              key={item.itemId + '_poi_' + index}
              onMouseEnter={() => setActiveTooltip(index)}
              //style={{ left: adjustedPinX, top: adjustedPinY }}
            ></div>
            <div
              className={`poi poi-tooltip ${activeTooltip === index ? 'active' : ''}`}
              key={item.itemId + '_poi_tooltip_' + index}
              id={item.itemId + '_poi_tooltip_' + index}
              aria-label={poi.title}
              style={{
                opacity: activeTooltip === index ? 1 : 0,
              }}
            >{`${poi.title}`}</div>
          </div>
        );
      };
      return (
        <div>
          <WrappedComponent {...restProps} />
          {pois?.map(PinOnCroppedImage)}
        </div>
      );
    } else {
      return <WrappedComponent {...restProps} />;
    }
  };
};

export default ImageWrapperHOC;
