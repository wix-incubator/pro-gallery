import React from 'react';
import { GalleryComponent } from '../galleryComponent';
import ImageRenderer from './imageRenderer';
import { GALLERY_CONSTS } from 'pro-gallery-lib';
//http://localhost:3000/?hoveringBehaviour=NEVER_SHOW&itemClick=magnify&galleryLayout=2
export default class MagnifiedItem extends GalleryComponent {
  constructor(props) {
    super(props);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.isMagnifiedBiggerThanContainer =
      this.isMagnifiedBiggerThanContainer.bind(this);
    this.containerRef = null;
    const { x, y } = props.startPos;
    this.state = {
      x: x || 0,
      y: y || 0,
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
    const { x, y } = this.state;
    this.dragStartY = y + clientY;
    this.dragStartX = x + clientX;
    this.dragStarted = true;
  }
  onMouseUp() {
    const { toggleMagnify } = this.props;
    if (!this.isDragging) {
      toggleMagnify(false);
    }
    this.dragStarted = false;
    this.isDragging = false;
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
  getContainerStyle() {
    const { x, y } = this.state;
    const { style } = this.props;
    const { magnifiedWidth, magnifiedHeight } = style;

    const styles = {
      zIndex: 1000,
      position: 'relative',
      cursor: 'grab',
      width: magnifiedWidth,
      height: magnifiedHeight,
    };

    if (this.isMagnifiedBiggerThanContainer(style)) {
      Object.assign(styles, {
        transform: `translate(${-x}px, ${-y}px)`,
      });
    } else {
      Object.assign(styles, {
        transform: `translate(-50%, -50%)`,
        top: '50%',
        left: '50%',
      });
    }
    return styles;
  }
  render() {
    return (
      <div
        className={'magnified-item-container'}
        style={this.getContainerStyle()}
        onDragStart={this.onDragStart}
        onMouseMove={this.onMouseMove}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
      >
        {this.getPreloadImage()}
        {this.getHighResImage()}
      </div>
    );
  }
}
