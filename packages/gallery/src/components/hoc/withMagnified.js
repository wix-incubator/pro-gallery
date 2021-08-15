import React, { Component } from 'react';
import { GALLERY_CONSTS } from 'pro-gallery-lib';
import ImageRenderer from '../item/imageRenderer';

function withMagnified(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      console.log(props);
      super(props);
      this.onMouseMove = this.onMouseMove.bind(this);
      this.onMouseDown = this.onMouseDown.bind(this);
      this.onMouseUp = this.onMouseUp.bind(this);
      this.isMagnifiedBiggerThanContainer =
        this.isMagnifiedBiggerThanContainer.bind(this);
      this.toggleMagnify = this.toggleMagnify.bind(this);
      this.getMagnifyInitialPos = this.getMagnifyInitialPos.bind(this);
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
        const {
          cubedWidth,
          cubedHeight,
          innerWidth,
          innerHeight,
          magnifiedWidth,
          magnifiedHeight,
        } = this.props.style;
        const { clientY, clientX } = e;
        this.setState({
          x: Math.max(
            0,
            Math.min(
              this.dragStartX - clientX,
              magnifiedWidth - Math.max(cubedWidth, innerWidth)
            )
          ),
          y: Math.max(
            0,
            Math.min(
              this.dragStartY - clientY,
              magnifiedHeight - Math.max(cubedHeight, innerHeight)
            )
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
      const { style, offset } = this.props;
      const {
        magnifiedWidth,
        magnifiedHeight,
        cubedWidth,
        cubedHeight,
        innerWidth,
        innerHeight,
      } = style;
      const { top, left } = offset;
      return {
        x: Math.max(
          0,
          Math.min(
            clientX - left,
            magnifiedWidth - Math.max(cubedWidth, innerWidth)
          )
        ),
        y: Math.max(
          0,
          Math.min(
            clientY - top,
            magnifiedHeight - Math.max(cubedHeight, innerHeight)
          )
        ),
      };
    }

    shouldMagnifyImage() {
      const { itemClick } = this.props.styleParams;
      const { itemTypes } = GALLERY_CONSTS;
      const { type } = this.props;
      return (
        itemClick === GALLERY_CONSTS.itemClick.MAGNIFY &&
        (type === itemTypes.IMAGE || type === itemTypes.PICTURE)
      ); //use const / extract to function;
    }

    getContainerStyle() {
      const { x, y, shouldMagnify } = this.state;
      const { style } = this.props;
      const { magnifiedWidth, magnifiedHeight } = style;

      const magnifiedStyles = {
        zIndex: 1000,
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
      if (shouldMagnify) {
        return magnifiedStyles;
      } else {
        return {
          width: '100%',
          height: '100%',
        };
      }
    }
    render() {
      const { shouldMagnify } = this.state;
      return (
        <div
          className={'magnified-item-container'}
          style={this.getContainerStyle()}
          onDragStart={this.onDragStart}
          onMouseMove={this.onMouseMove}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
        >
          {!shouldMagnify ? (
            <WrappedComponent {...this.props} />
          ) : (
            <>
              {this.getPreloadImage()}
              {this.getHighResImage()}
            </>
          )}
        </div>
      );
    }
  };
}

export default withMagnified;
