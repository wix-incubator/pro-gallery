import React from 'react';
import { PrintOnlyImageSource } from './printOnlySource';

const ImageRenderer = ({ customImageRenderer, ...restProps }) => {
  if (typeof customImageRenderer === 'function') {
    return customImageRenderer(restProps);
  } else if (typeof restProps.src === 'string') {
    return <img alt={restProps.alt} {...restProps} />;
  } else if (typeof restProps.src === 'object') {
    return (
      <picture
        id={`multi_picture_${restProps.id}`}
        key={`multi_picture_${restProps.id}`}
      >
        {restProps.src.map((src) =>
          src.forPrinting ? (
            <PrintOnlyImageSource srcSet={src.dpr} type={`image/${src.type}`} />
          ) : (
            <source srcSet={src.dpr || src.url} type={`image/${src.type}`} />
          )
        )}
        <img
          alt={restProps.alt}
          {...restProps}
          src={restProps.src[restProps.src.length - 1].url}
        />
      </picture>
    );
  } else {
    return null;
  }
};

export default ImageRenderer;
