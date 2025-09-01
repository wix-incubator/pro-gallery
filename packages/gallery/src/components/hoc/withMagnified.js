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
      this.getBoundrys = this.getBoundrys.bind(this);
      this.getMagnifiedDimensions = this.getMagnifiedDimensions.bind(this);
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
        const { magnifiedWidth, magnifiedHeight } =
          this.getMagnifiedDimensions();
        this.isDragging = true;
        const { cubedWidth, cubedHeight } = this.props.style;
        const { clientY, clientX } = e;
        const { boundryY, boundryX } = this.getBoundrys();
        this.setState({
          x: Math.max(
            -boundryX,
            Math.min(this.dragStartX - clientX, magnifiedWidth - cubedWidth)
          ),
          y: Math.max(
            -boundryY,
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

    getMagnifiedDimensions() {
      const {
        style: { innerHeight, innerWidth },
        options: { behaviourParams },
      } = this.props;
      const { magnificationValue } = behaviourParams.item.content;
      return {
        magnifiedHeight: innerHeight * magnificationValue,
        magnifiedWidth: innerWidth * magnificationValue,
      };
    }
    getPreloadImage() {
      const { createUrl, id, style, imageDimensions, options } = this.props;
      const { innerWidth, innerHeight } = style;
      const { marginTop, marginLeft } = imageDimensions;
      const { shouldMagnify, x, y } = this.state;
      const { magnificationValue } = options.behaviourParams.item.content;
      const src = createUrl(
        GALLERY_CONSTS.urlSizes.RESIZED,
        GALLERY_CONSTS.urlTypes.HIGH_RES
      );
      const scale = shouldMagnify ? magnificationValue : 1;
      return (
        <ImageRenderer
          alt=""
          key={'magnified-item-preload-' + id}
          className="magnified-item-preload"
          src={src}
          style={{
            width: innerWidth,
            height: innerHeight,
            position: 'relative',
            zIndex: 1,
            opacity: shouldMagnify ? 1 : 0,
            transform: `scale(${scale})`,
            transformOrigin: `${
              (x + marginLeft) / (magnificationValue - 1)
            }px ${(y + marginTop) / (magnificationValue - 1)}px`,
            transition: `transform 0.3s ease${
              shouldMagnify ? '' : ', opacity 0.1s ease 0.3s'
            }`,
          }}
          customImageRenderer={this.props.customComponents?.customImageRenderer}
        />
      );
    }

    getHighResImage() {
      const { createMagnifiedUrl, id, alt, options } = this.props;
      const { magnifiedWidth, magnifiedHeight } = this.getMagnifiedDimensions();
      const src = createMagnifiedUrl(
        options.behaviourParams.item.content.magnificationValue
      );
      return (
        <ImageRenderer
          key={`magnified-item-${id}`}
          className="magnified-item"
          data-hook="magnified-item"
          src={src}
          alt={typeof alt === 'string' ? alt : 'untitled image'}
          id={id}
          style={{
            width: magnifiedWidth,
            height: magnifiedHeight,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          customImageRenderer={this.props.customComponents?.customImageRenderer}
        />
      );
    }

    isMagnifiedBiggerThanContainer(itemStyle) {
      const { magnifiedWidth, magnifiedHeight } = this.getMagnifiedDimensions();
      const { cubedWidth, cubedHeight } = itemStyle;

      return cubedWidth < magnifiedWidth || cubedHeight < magnifiedHeight;
    }

    getMagnifyInitialPos(e) {
      const { clientX, clientY } = e;
      const { style } = this.props;
      const { magnifiedWidth, magnifiedHeight } = this.getMagnifiedDimensions();
      const { cubedWidth, cubedHeight } = style;
      const { top, left } = this.containerRef.getBoundingClientRect();

      const x =
        ((clientX - left) / cubedWidth) * magnifiedWidth - (clientX - left);
      const y =
        ((clientY - top) / cubedHeight) * magnifiedHeight - (clientY - top);

      const { boundryY, boundryX } = this.getBoundrys();
      return {
        x: Math.max(-boundryX, Math.min(x, magnifiedWidth - cubedWidth)),
        y: Math.max(-boundryY, Math.min(y, magnifiedHeight - cubedHeight)),
      };
    }

    getBoundrys() {
      const { style } = this.props;
      const { magnifiedWidth, magnifiedHeight } = this.getMagnifiedDimensions();
      const { cubedWidth, cubedHeight } = style;
      const boundryY =
        magnifiedHeight < cubedHeight
          ? cubedHeight / 2 - magnifiedHeight / 2
          : 0;
      const boundryX =
        magnifiedWidth < cubedWidth ? cubedWidth / 2 - magnifiedWidth / 2 : 0;
      return {
        boundryY,
        boundryX,
      };
    }

    getContainerStyle() {
      const { shouldMagnify } = this.state;
      const { style } = this.props;
      const { cubedWidth, cubedHeight } = style;
      return {
        width: cubedWidth,
        height: cubedHeight,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: shouldMagnify ? 'zoom-out' : 'zoom-in',
      };
    }

    getMagnifiedImageStyle() {
      const { shouldMagnify, x, y } = this.state;
      return {
        zIndex: 2,
        position: 'absolute',
        top: 0,
        left: 0,
        transform: `translate(${-x}px, ${-y}px)`,
        opacity: shouldMagnify ? 1 : 0,
        transition: 'opacity 0.1s ease',
        transitionDelay: shouldMagnify ? '0.3s' : 'none',
      };
    }
    render() {
      console.log('render ==>');
      const { shouldMagnify } = this.state;
      const { itemClick } = this.props.options;
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
          {this.getPreloadImage()}
          <div
            className={'magnified-images'}
            style={this.getMagnifiedImageStyle()}
          >
            {shouldMagnify && this.getHighResImage()}
          </div>
        </div>
      );
    }
  };
}

export default withMagnified;
