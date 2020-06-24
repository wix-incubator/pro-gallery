import React from 'react';
import { GalleryComponent } from '../../galleryComponent';
import { URL_TYPES, URL_SIZES } from '../../../common/constants/urlTypes';
import PlayBackground from '../../svgs/components/play_background';
import PlayTriangle from '../../svgs/components/play_triangle';
import LAZY_LOAD from '../../../common/constants/lazyLoad';
import { isSEOMode } from '../../../common/window/viewModeWrapper';

class VideoItemPlaceholder extends GalleryComponent {
  createImageElement() {
    const {
      alt,
      createUrl,
      id,
      lazyLoad,
      styleParams,
    } = this.props;
    
    const url = createUrl(URL_SIZES.RESIZED, isSEOMode() ? URL_TYPES.SEO : URL_TYPES.HIGH_RES)
    const image = (<img
    key={
      (styleParams.cubeImages && styleParams.cubeType === 'fill'
        ? 'cubed-'
        : '') + 'image'
    }
    className={'gallery-item-visible gallery-item gallery-item-preloaded'}
    alt={alt ? alt : 'untitled image'}
    src={url}
    loading="lazy"
  />)

  const canvas = (<canvas
    key={'image-' + id}
    alt={alt ? alt : 'untitled video'}
    className={'gallery-item-hidden gallery-item-visible gallery-item gallery-item-preloaded'}
    data-src={url}
  />)

    const useImageTag = lazyLoad === LAZY_LOAD.NATIVE || isSEOMode();
    return useImageTag ? image : canvas;
  }
  render() {
    const { marginLeft, marginTop, ...restOfDimensions } =
      this.props.imageDimensions || {};
    const showVideoControls = this.props.hidePlay ? false : this.props.styleParams.showVideoPlayButton;
    const videoControls = !showVideoControls
      ? false
      : [
          <i
            key="play-triangle"
            data-hook="play-triangle"
            className={
              'gallery-item-video-play-triangle play-triangle '
            }
          ><PlayTriangle/></i>,
          <i
            key="play-bg"
            data-hook="play-background"
            className={
              'gallery-item-video-play-background play-background '
            }
          ><PlayBackground/></i>,
        ];

    const baseClassName =
      'gallery-item-content gallery-item-visible gallery-item-preloaded gallery-item-video gallery-item video-item';
    const placeHolder = (
      <div
        className={baseClassName}
        data-hook="video-placeholder_container-image-element"
        key={'video-and-hover-container' + this.props.id}
        style={{
          backgroundImage: `url(${this.props.createUrl(
            URL_SIZES.RESIZED,
            URL_TYPES.HIGH_RES,
          )})`,
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
