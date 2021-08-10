import React from 'react';
import { GalleryComponent } from '../galleryComponent';
import ImageRenderer from './imageRenderer';
import { GALLERY_CONSTS } from 'pro-gallery-lib';
//http://localhost:3000/?hoveringBehaviour=NEVER_SHOW&itemClick=magnify&galleryLayout=2
export default class magnifiedItem extends GalleryComponent {
  constructor(props) {
    super(props);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.containerRef = null;
    // const { x, y } = props.startPos;
    this.state = {
      x: 0,
      y: 0,
      isDragging: false,
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
    const { createUrl, id, alt } = this.props;
    const src = createUrl(
      GALLERY_CONSTS.urlSizes.MAGNIFIED,
      GALLERY_CONSTS.urlTypes.HIGH_RES
    );
    return (
      <ImageRenderer
        key={`magnified-item-${this.props.id}`}
        className="magnified-item"
        data-hook="magnified-item"
        src={src}
        alt={alt ? alt : 'untitled image'}
        id={id}
      />
    );
  }

  render() {
    const { x, y } = this.state;
    return (
      <div
        className={'magnified-item-container'}
        style={{
          zIndex: 1000,
          position: 'relative',
          cursor: 'grab',
          transform: `translate(${-x}px, ${-y}px)`,
        }}
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
