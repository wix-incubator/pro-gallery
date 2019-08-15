import React from 'react';
import { GalleryComponent } from '../../galleryComponent';

class VideoItemPlaceholder extends GalleryComponent {
  createImageElement() {
    return (
      <img
        ref={img => {
          // onLoad replacement for SSR
          if (!img) {
            return;
          }
          img.onload = this.props.actions.setItemLoaded; //initializing onLoad for further calls
          if (img.complete && !this.props.loadingStatus.loaded) {
            this.props.actions.setItemLoaded(); //first call, will not be called again because if it was called once loadingStatus.loaded will be true
          }
        }}
        onError={this.props.actions.setItemError}
        key={'image-' + this.props.id}
        className={
          'gallery-item-hidden gallery-item-visible gallery-item ' +
          (this.props.loadingStatus.loaded ? ' gallery-item-loaded ' : '') +
          (this.props.loadingStatus.failed ? ' failed ' : '')
        }
        src={this.props.resized_url.img}
      />
    );
  }
  render() {
    const { marginLeft, marginTop, ...restOfDimensions } =
      this.props.imageDimensions || {};
    const videoControls = this.props.hidePlay
      ? false
      : [
          <i
            key="play-triangle"
            data-hook="play-triangle"
            className={
              'gallery-item-video-play-triangle progallery-svg-font-icons-play-triangle '
            }
          />,
          <i
            key="play-bg"
            data-hook="play-background"
            className={
              'gallery-item-video-play-background progallery-svg-font-icons-play-background '
            }
          />,
        ];

    const baseClassName =
      'gallery-item-content gallery-item-visible gallery-item-preloaded gallery-item-video gallery-item';
    const placeHolder = (
      <div
        className={baseClassName}
        data-hook="video-placeholder_container-image-element"
        key={'video-and-hover-container' + this.props.id}
        style={{
          backgroundImage: `url(${this.props.resized_url.img})`,
          ...restOfDimensions,
        }}
      >
        {this.createImageElement()}
        {videoControls}
      </div>
    );

    const hover = this.props.hover;

    return (
      <div key={'video-and-hover-container' + this.props.idx}>
        {[placeHolder, hover]}
      </div>
    );
  }
}

export default VideoItemPlaceholder;
