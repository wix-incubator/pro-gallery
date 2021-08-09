import React from 'react';
import { GalleryComponent } from '../galleryComponent';
import ImageRenderer from './imageRenderer';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

export default class magnifiedItem extends GalleryComponent {
  constructor(props) {
    super(props);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.containerRef = null;
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
    const { isDragging } = this.state;
    if (isDragging) {
      const { clientY, clientX } = e;
      const { top, left } = this.containerRef.getBoundingClientRect();
      const currentPos = {
        x: clientX - left,
        y: clientY - top,
      };
      this.setState({
        x: this.dragStartX - currentPos.x,
        y: this.dragStartY - currentPos.y,
      });
    }
  }
  onMouseDown(e) {
    const { clientX, clientY } = e;
    const { x, y } = this.state;
    const { top, left } = this.containerRef.getBoundingClientRect();
    this.dragStartY = y + clientY - top;
    this.dragStartX = x + clientX - left;
    this.setState({ isDragging: true });
  }
  onMouseUp() {
    this.setState({
      isDragging: false,
    });
  }
  render() {
    const { createUrl } = this.props;
    const { x, y } = this.state;
    const src = createUrl(
      GALLERY_CONSTS.urlSizes.MAGNIFIED,
      GALLERY_CONSTS.urlTypes.HIGH_RES
    );
    return (
      <div
        className={'magnified-item-wrapper'}
        ref={(element) => (this.containerRef = element)}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 1000,
        }}
        onDragStart={this.onDragStart}
        onMouseMove={this.onMouseMove}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
      >
        <div
          style={{
            zIndex: 1000,
            position: 'relative',
            cursor: 'grab',
            transform: `translate(${-x}px, ${-y}px)`,
          }}
        >
          <ImageRenderer
            key={'magnified-item'}
            className={`magnified-item`}
            data-hook="magnified-item"
            src={src}
            alt={'untitled image'}
            id={this.props.id}
            // style={{
            //   ...imageSizing,
            //   ...blockDownloadStyles,
            //   ...(!shouldRenderHighResImages && preloadStyles),
            // }}
            // {...imageProps}
          />
        </div>
      </div>
    );
  }
}
