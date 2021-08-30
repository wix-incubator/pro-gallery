import React, { Component } from 'react';
import { GALLERY_CONSTS } from 'pro-gallery-lib';
import ImageRenderer from '../item/imageRenderer';

function withMagnified(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.onMouseMove = this.onMouseMove.bind(this);
      this.onMouseDown = this.onMouseDown.bind(this);
      this.onMouseUp = this.onMouseUp.bind(this);
      this.isMagnifiedBiggerThanContainer =
        this.isMagnifiedBiggerThanContainer.bind(this);
      this.toggleMagnify = this.toggleMagnify.bind(this);
      this.getMagnifyInitialPos = this.getMagnifyInitialPos.bind(this);
      this.containerRef = null;
      this.state = {
        shouldMagnify: false,
        x: 0,
        y: 0,
        shouldTransition: true,
      };
    }

    onDragStart(e) {
      e.preventDefault();
    }

    onMouseMove(e) {
      if (this.dragStarted) {
        this.isDragging = true;
        const { cubedWidth, cubedHeight, magnifiedWidth, magnifiedHeight } =
          this.props.style;
        const { clientY, clientX } = e;
        this.setState({
          shouldTransition: false,
          x: Math.max(
            0,
            Math.min(this.dragStartX - clientX, magnifiedWidth - cubedWidth)
          ),
          y: Math.max(
            0,
            Math.min(this.dragStartY - clientY, magnifiedHeight - cubedHeight)
          ),
        });
      }
    }

    onMouseDown(e) {
      const { clientX, clientY } = e;
      const { x, y, shouldMagnify } = this.state;
      if (!shouldMagnify) {
        this.setState(this.getMagnifyInitialPos(e));
      } else {
        this.dragStartX = x + clientX;
        this.dragStartY = y + clientY;
        this.dragStarted = true;
      }
    }
    onMouseUp() {
      if (!this.isDragging) {
        this.toggleMagnify();
        this.setState({ shouldTransition: true });
      }
      this.dragStarted = false;
      this.isDragging = false;
    }

    toggleMagnify(bool) {
      const { shouldMagnify } = this.state;
      if (typeof bool === 'boolean') {
        this.setState({ shouldMagnify: bool });
      } else {
        this.setState({ shouldMagnify: !shouldMagnify });
      }
    }

    getPreloadImage() {
      const { createUrl, id, style, imageDimensions, options } = this.props;
      const { innerWidth, innerHeight } = style;
      const { marginTop, marginLeft } = imageDimensions;
      const { shouldMagnify } = this.state;
      const src = createUrl(
        GALLERY_CONSTS.urlSizes.RESIZED,
        GALLERY_CONSTS.urlTypes.HIGH_RES
      );
      const scale = options.magnificationLevel;
      return (
        <ImageRenderer
          alt=""
          key={'magnified-item-preload-' + id}
          className="magnified-item-preload"
          src={src}
          style={{
            width: innerWidth,
            height: innerHeight,
            marginTop,
            marginLeft,
            transform: `scale(${shouldMagnify ? scale : 1})`,
            opacity: shouldMagnify ? 1 : 0,
            transformOrigin: `${marginLeft}px ${marginTop}px`,
            position: 'absolute',
            transition: `transform .3s ease${
              !shouldMagnify ? ', opacity .1s 0.3s' : ''
            }`,
          }}
        />
      );
    }

    getHighResImage() {
      const { createUrl, id, alt, style } = this.props;
      const { magnifiedWidth, magnifiedHeight } = style;
      const src = createUrl(
        GALLERY_CONSTS.urlSizes.MAGNIFIED,
        GALLERY_CONSTS.urlTypes.HIGH_RES
      );
      return (
        <ImageRenderer
          key={`magnified-item-${id}`}
          className="magnified-item"
          data-hook="magnified-item"
          src={src}
          alt={alt ? alt : 'untitled image'}
          id={id}
          style={{
            width: magnifiedWidth,
            height: magnifiedHeight,
          }}
        />
      );
    }

    isMagnifiedBiggerThanContainer(itemStyle) {
      const { cubedWidth, cubedHeight, magnifiedWidth, magnifiedHeight } =
        itemStyle;

      return cubedWidth < magnifiedWidth && cubedHeight < magnifiedHeight;
    }

    getMagnifyInitialPos(e) {
      const { clientX, clientY } = e;
      const { style } = this.props;
      const { magnifiedWidth, magnifiedHeight, cubedWidth, cubedHeight } =
        style;
      const { top, left } = this.containerRef.getBoundingClientRect();

      const x =
        ((clientX - left) / cubedWidth) * magnifiedWidth - (clientX - left);
      const y =
        ((clientY - top) / cubedHeight) * magnifiedHeight - (clientY - top);
      return {
        x: Math.max(0, Math.min(x, magnifiedWidth - cubedWidth)),
        y: Math.max(0, Math.min(y, magnifiedHeight - cubedHeight)),
      };
    }
    getImageContainerStyle() {
      const { shouldMagnify } = this.state;
      return {
        opacity: shouldMagnify ? 1 : 0,
        transition: shouldMagnify ? 'opacity 0.1s 0.3s' : '',
      };
    }

    getContainerStyle() {
      const { x, y, shouldMagnify, shouldTransition } = this.state;
      const { style } = this.props;
      const { magnifiedWidth, magnifiedHeight } = style;
      if (shouldMagnify) {
        const magnifiedStyles = {
          position: 'relative',
          cursor: 'zoom-out',
          width: magnifiedWidth,
          height: magnifiedHeight,
          transition: shouldTransition ? 'transform .3s ease' : 'none',
        };

        if (this.isMagnifiedBiggerThanContainer(style)) {
          Object.assign(magnifiedStyles, {
            transform: `translate(${-x}px, ${-y}px)`,
          });
        } else {
          Object.assign(magnifiedStyles, {
            transform: `translate(-50%, -50%)`,
            top: '50%',
            left: '50%',
          });
        }
        return magnifiedStyles;
      } else {
        return {
          width: '100%',
          height: '100%',
          cursor: 'zoom-in',
        };
      }
    }

    render() {
      const { shouldMagnify } = this.state;
      const { itemClick } = this.props.options;
      if (itemClick !== GALLERY_CONSTS.itemClick.MAGNIFY) {
        return (
          <div className="test">
            <WrappedComponent {...this.props} />
          </div>
        );
      }
      return (
        <div
          ref={(ref) => (this.containerRef = ref)}
          className={'magnified-item-container'}
          style={this.getContainerStyle()}
          onDragStart={this.onDragStart}
          onMouseMove={this.onMouseMove}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
        >
          <WrappedComponent {...this.props} />
          {this.getPreloadImage()}
          <div
            style={this.getImageContainerStyle()}
            className={'magnified-image-container'}
          >
            {shouldMagnify && this.getHighResImage()}
          </div>
        </div>
      );
    }
  };
}

export default withMagnified;
