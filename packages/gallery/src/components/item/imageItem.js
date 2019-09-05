import React from 'react';
import LOADING_MODE from '../../constants/loadingMode';
import { GalleryComponent } from '../galleryComponent';
import { isSEOMode } from '../../utils/window/viewModeWrapper';
import { URL_TYPES, URL_SIZES } from '../../constants/urlTypes';

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
      displayed,
      imageDimensions,
      createUrl,
      id,
      actions,
      settings,
      styleParams,
    } = this.props;
    const imageProps =
      settings &&
      settings.imageProps &&
      typeof settings.imageProps === 'function'
        ? settings.imageProps(id)
        : {};
    const backgroundStyle = {}; //remove this inline style if rendered padding (using css) is used
    const { marginLeft, marginTop, ...restOfDimensions } =
      imageDimensions || {};
    const isSEO = isSEOMode();
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
          style={displayed ? {} : { ...backgroundStyle, ...restOfDimensions }}
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
        className={'gallery-item-visible gallery-item gallery-item-preloaded'}
        alt={alt ? alt : 'untitled image'}
        src={createUrl(URL_SIZES.RESIZED, URL_TYPES.SEO)}
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
        role="img"
        alt={alt ? alt : 'untitled image'}
        data-src={createUrl(URL_SIZES.RESIZED, URL_TYPES.HIGH_RES)}
        style={restOfDimensions}
        {...imageProps}
      />
    );

    const renderedItem = isSEO ? imageContainer(image) : imageContainer(canvas);
    return renderedItem;
  }
}
