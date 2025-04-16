import React from 'react';
import { PrintOnlyImageSource } from './printOnlySource';

class ImageRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.imageRef = null;
  }
  componentDidMount() {
    if (this.imageRef?.complete && typeof this.props.onLoad === 'function') {
      this.props.onLoad();
    }
  }
  render() {
    const { customImageRenderer, ...imageProps } = this.props; // customImageRenderer is not valid for dom elements.
    if (typeof customImageRenderer === 'function') {
      return customImageRenderer(this.props);
    } else if (typeof this.props.src === 'string') {
      return (
        <img
          ref={(ref) => {
            this.imageRef = ref;
          }}
          alt={this.props.alt}
          {...imageProps}
        />
      );
    } else if (typeof this.props.src === 'object') {
      return (
        <picture id={`multi_picture_${this.props.id}`} key={`multi_picture_${this.props.id}`}>
          {this.props.src.map((src, index) =>
            src.forPrinting ? (
              <PrintOnlyImageSource key={`print-only-image-${index}`} srcSet={src.dpr} type={`image/${src.type}`} />
            ) : (
              <source key={`image-source-${index}`} srcSet={src.dpr || src.url} type={`image/${src.type}`} />
            )
          )}
          <img
            ref={(ref) => {
              this.imageRef = ref;
            }}
            alt={this.props.alt}
            {...imageProps}
            src={this.props.src[this.props.src.length - 1].url}
          />
        </picture>
      );
    } else {
      return null;
    }
  }
}

export default ImageRenderer;
