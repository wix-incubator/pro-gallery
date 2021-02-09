const ImageRenderer = (imageProps) => {
  if (typeof ImageRenderer.customImageRenderer === 'function') {
    return ImageRenderer.customImageRenderer(imageProps);
  } else {
    return <img {...imageProps} />;
  }
};

export default ImageRenderer;
