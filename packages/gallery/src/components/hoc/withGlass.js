import React, { Component } from 'react';
import { GALLERY_CONSTS } from 'pro-gallery-lib';
import ImageRenderer from '../item/imageRenderer';

function withGlass(WrappedComponent) {
  return class withGlass extends Component {
    constructor(props) {
      super(props);
      this.onMouseMove = this.onMouseMove.bind(this);
      this.onMouseEnter = this.onMouseEnter.bind(this);
      this.onMouseLeave = this.onMouseLeave.bind(this);
      this.containerRef = null;
      this.state = {
        x: 0,
        y: 0,
        shouldMagnify: false,
      };
    }
    onMouseMove(e) {
      const { clientX, clientY } = e;
      const { top, left } = this.containerRef.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;
      this.setState({ x, y });
    }

    getMagnifiedDimensions() {
      const {
        style,
        options: { magnificationLevel },
      } = this.props;
      const { innerHeight, innerWidth } = style;
      return {
        magnifiedHeight: innerHeight * magnificationLevel,
        magnifiedWidth: innerWidth * magnificationLevel,
      };
    }

    onMouseEnter() {
      this.setState({
        shouldMagnify: true,
      });
    }

    onMouseLeave() {
      this.setState({
        shouldMagnify: false,
      });
    }
    getHighResImage() {
      const {
        createMagnifiedUrl,
        id,
        alt,
        options: { magnificationLevel },
      } = this.props;
      const { magnifiedWidth, magnifiedHeight } = this.getMagnifiedDimensions();
      const src = createMagnifiedUrl(magnificationLevel);
      return (
        <ImageRenderer
          key={`magnified-item-${id}`}
          className="magnified-item"
          data-hook="magnified-item"
          src={src}
          alt={alt ? alt : 'untitled image'}
          id={id}
          style={{
            zIndex: 2,
            width: magnifiedWidth,
            height: magnifiedHeight,
            position: 'absolute',
          }}
        />
      );
    }

    getPreloadImage() {
      const { createUrl, id } = this.props;
      const { magnifiedWidth, magnifiedHeight } = this.getMagnifiedDimensions();
      const src = createUrl(
        GALLERY_CONSTS.urlSizes.RESIZED,
        GALLERY_CONSTS.urlTypes.HIGH_RES
      );
      return (
        <ImageRenderer
          alt=""
          key={'magnified-item-preload-' + id}
          className="magnified-item-preload"
          src={src}
          style={{
            width: magnifiedWidth,
            height: magnifiedHeight,
            position: 'absolute',
            zIndex: -1,
          }}
        />
      );
    }
    getMagnifyingLensStyle() {
      const { x, y } = this.state;
      return {
        width: 200,
        height: 200,
        backgroundColor: 'white',
        border: '2px solid white',
        position: 'absolute',
        transform: `translate(${x - 100}px, ${y - 100}px)`,
        overflow: 'hidden',
        borderRadius: '50%',
      };
    }
    getMagnifiedImagesStyle() {
      const { x, y } = this.state;
      const {
        options: { magnificationLevel },
      } = this.props;
      const { magnifiedWidth, magnifiedHeight } = this.getMagnifiedDimensions();
      return {
        position: 'relative',
        transform: `translate(${-x * magnificationLevel + 100}px, ${
          -y * magnificationLevel + 100
        }px)`,
        width: magnifiedWidth,
        height: magnifiedHeight,
      };
    }
    getMagnifiedItemContainerStyle() {
      const { innerWidth, innerHeight } = this.props.style;
      const { marginTop, marginLeft } = this.props.imageDimensions;
      return {
        cursor: 'none',
        width: innerWidth,
        height: innerHeight,
        marginTop,
        marginLeft,
        position: 'absolute',
        overflow: 'hidden',
      };
    }
    render() {
      const { shouldMagnify } = this.state;
      const { cubedHeight, cubedWidth } = this.props.style;
      const { itemClick, magnificationType } = this.props.options;
      if (
        itemClick !== GALLERY_CONSTS.itemClick.MAGNIFY ||
        magnificationType !== GALLERY_CONSTS.magnificationType.GLASS
      ) {
        return <WrappedComponent {...this.props} />;
      }
      return (
        <div
          style={{
            width: cubedWidth,
            height: cubedHeight,
          }}
        >
          <WrappedComponent {...this.props} />
          <div
            classname="magnified-item-container"
            ref={(ref) => (this.containerRef = ref)}
            onMouseMove={this.onMouseMove}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            style={this.getMagnifiedItemContainerStyle()}
          >
            {shouldMagnify && (
              <div
                className="magnifying-lens"
                style={this.getMagnifyingLensStyle()}
              >
                <div
                  className="magnified-images"
                  style={this.getMagnifiedImagesStyle()}
                >
                  {this.getPreloadImage()}
                  {this.getHighResImage()}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
  };
}

export default withGlass;
