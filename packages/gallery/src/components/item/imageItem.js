import React from 'react';
import LOADING_MODE from '../../common/constants/loadingMode';
import LAZY_LOAD from '../../common/constants/lazyLoad';
import { GalleryComponent } from '../galleryComponent';
import { isSEOMode } from '../../common/window/viewModeWrapper';
import { URL_TYPES, URL_SIZES } from '../../common/constants/urlTypes';

export default class ImageItem extends GalleryComponent {
  componentDidMount() {
    try {
      if (typeof this.props.actions.setItemLoaded === 'function') {
        this.props.actions.setItemLoaded();
      }
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const {
      alt,
      imageDimensions,
      createUrl,
      id,
      actions,
      settings,
      lazyLoad,
      styleParams,
    } = this.props;
    const imageProps =
      settings &&
      settings.imageProps &&
      typeof settings.imageProps === 'function'
        ? settings.imageProps(id)
        : {};

    const { marginLeft, marginTop, ...restOfDimensions } =
      imageDimensions || {};
    const useImageTag = lazyLoad === LAZY_LOAD.NATIVE || isSEOMode();
    const imageItemClassName = [
      'gallery-item-content',
      'image-item',
      'gallery-item-visible',
      'gallery-item',
      'gallery-item-preloaded',
      styleParams.cubeImages && styleParams.cubeType === 'fit'
        ? 'grid-fit'
        : '',
      styleParams.imageLoadingMode === LOADING_MODE.COLOR
        ? 'load-with-color'
        : '',
    ].join(' ');
    const imageContainer = image => {
      return (
        <div
          className={imageItemClassName}
          onTouchStart={actions.handleItemMouseDown}
          onTouchEnd={actions.handleItemMouseUp}
          key={'image_container-' + id}
          data-hook={'image-item'}
          style={imageDimensions.borderRadius ? {borderRadius: imageDimensions.borderRadius} : {}}
        >
          {image}
        </div>
      );
    };
    const image = (
      <img
        key={
          (styleParams.cubeImages && styleParams.cubeType === 'fill'
            ? 'cubed-'
            : '') + 'image'
        }
        className={'gallery-item-visible gallery-item gallery-item-hidden gallery-item-preloaded'}
        data-hook='gallery-item-image-img'
        alt={alt ? alt : 'untitled image'}
        src={createUrl(URL_SIZES.RESIZED, isSEOMode() ? URL_TYPES.SEO : URL_TYPES.HIGH_RES)}
        loading="lazy"
        style={restOfDimensions}
        {...imageProps}
      />
    );
    const canvas = (
      <canvas
        key={
          (styleParams.cubeImages && styleParams.cubeType === 'fill'
            ? 'cubed-'
            : '') + 'image'
        }
        className={
          'gallery-item-visible gallery-item gallery-item-hidden gallery-item-preloaded'
        }
        data-hook='gallery-item-image-canvas'
        role="img"
        alt={alt ? alt : 'untitled image'}
        data-src={createUrl(URL_SIZES.RESIZED, URL_TYPES.HIGH_RES)}
        style={restOfDimensions}
        {...imageProps}
      />
    );

    const renderedItem = useImageTag ? imageContainer(image) : imageContainer(canvas);
    return renderedItem;
  }
}
