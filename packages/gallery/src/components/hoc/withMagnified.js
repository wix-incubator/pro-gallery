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
      const { createUrl, id, style } = this.props;
      const { magnifiedWidth, magnifiedHeight } = style;
      const src = createUrl(
        GALLERY_CONSTS.urlSizes.RESIZED,
        GALLERY_CONSTS.urlTypes.HIGH_RES
      );
      return (
        <ImageRenderer
          alt=""
          key={'magnified-item-preload-' + id}
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
      const { marginTop, marginLeft } = this.props.imageDimensions;
      const { top, left } = this.containerRef.getBoundingClientRect();
      return {
        x: Math.max(
          0,
          Math.min(clientX - left - marginLeft * 2, magnifiedWidth - cubedWidth)
        ),
        y: Math.max(
          0,
          Math.min(clientY - top - marginTop * 2, magnifiedHeight - cubedHeight)
        ),
      };
    }

    getContainerStyle() {
      const { x, y, shouldMagnify } = this.state;
      const { style } = this.props;
      const { magnifiedWidth, magnifiedHeight } = style;
      if (shouldMagnify) {
        const magnifiedStyles = {
          position: 'relative',
          cursor: 'grab',
          width: magnifiedWidth,
          height: magnifiedHeight,
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
          cursor: 'crosshair',
        };
      }
    }

    render() {
      const { shouldMagnify } = this.state;
      const { itemClick } = this.props.styleParams;
      if (itemClick !== GALLERY_CONSTS.itemClick.MAGNIFY) {
        return <WrappedComponent {...this.props} />;
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
          {shouldMagnify && (
            <div
              style={{
                zIndex: 1000,
                position: 'absolute',
              }}
            >
              {this.getPreloadImage()}
              {this.getHighResImage()}
            </div>
          )}
        </div>
      );
    }
  };
}

export default withMagnified;
