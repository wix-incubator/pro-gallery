import React from 'react';

const ImageRenderer = (props) => {
  if (typeof ImageRenderer.customImageRenderer === 'function') {
    return ImageRenderer.customImageRenderer(props);
  } else if (typeof props.src === 'string') {
    return <img alt={props.alt} {...props} />;
  } else if (typeof props.src === 'object') {
    return (
      <picture
        id={`multi_picture_${props.id}`}
        key={`multi_picture_${props.id}`}
      >
        {props.src.map((src) => (
          <source srcSet={src.dpr || src.url} type={`image/${src.type}`} />
        ))}
        <img alt={props.alt} {...props} src={props.src[0].url} />
      </picture>
    );
  }
};


export default ImageRenderer;
