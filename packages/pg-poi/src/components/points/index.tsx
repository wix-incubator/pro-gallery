import React from 'react';
const getImageAdjustments = ({ maxWidth, maxHeight, width, height }) => {
  const originalImage = {
    width: maxWidth,
    height: maxHeight,
  };
  const newImage = {
    width,
    height,
  };
  const focal = {
    x: 0.5,
    y: 0.5,
  };
  const originalWidth = originalImage.width;
  const originalHeight = originalImage.height;

  const newWidth = newImage.width;
  const newHeight = newImage.height;

  const originalAspectRatio = originalWidth / originalHeight;
  const newAspectRatio = newWidth / newHeight;

  const isCroppedHorizontally = originalAspectRatio < newAspectRatio;
  const isCroppedVertically = originalAspectRatio > newAspectRatio;

  const uncroppedDimensions = {
    ...newImage,
  };
  let margin;
  const margins = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  if (isCroppedHorizontally) {
    uncroppedDimensions.height = newWidth / originalAspectRatio;
    margin = uncroppedDimensions.height - newHeight;
    margins.top = margin * (1 - focal.y);
    margins.bottom = margin * focal.y;
  } else if (isCroppedVertically) {
    uncroppedDimensions.width = newHeight * originalAspectRatio;
    margin = uncroppedDimensions.width - newWidth;
    margins.left = margin * (1 - focal.x);
    margins.right = margin * focal.x;
  }

  const scaleX = uncroppedDimensions.width / originalWidth;
  const scaleY = uncroppedDimensions.height / originalHeight;

  margins.top = margins.top / scaleY;
  margins.bottom = margins.bottom / scaleY;
  margins.left = margins.left / scaleX;
  margins.right = margins.right / scaleX;

  return { margins, scaleX, scaleY };
};
const ImageWrapperHOC = (items) => (WrappedComponent) => {
  return (props) => {
    const { itemWrapperProps, ...restProps } = props;
    if (itemWrapperProps) {
      const { maxWidth, maxHeight, width, height } = itemWrapperProps.style;
      const { margins, scaleX, scaleY } = getImageAdjustments({ maxWidth, maxHeight, width, height });

      const pois = items[props['data-idx']]?.pois;
      const PinOnCroppedImage = (poi) => {
        const { x, y } = poi;
        const posX = maxWidth * x;
        const posY = maxHeight * y;
        const adjustedPinX = scaleX * (posX - margins.left);
        const adjustedPinY = scaleY * (posY - margins.top);

        return (
          <div
            style={{
              position: 'absolute',
              left: adjustedPinX,
              top: adjustedPinY,
              transform: 'translate(-50%, -50%)', // Center the pin
              background: 'red',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
            }}
          />
        );
      };
      return (
        <div>
          <WrappedComponent {...restProps} />
          {pois?.map(PinOnCroppedImage)}
        </div>
      );
    } else {
      return null; //<WrappedComponent {...restProps} />;
    }
  };
};

export default ImageWrapperHOC;
