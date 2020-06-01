import React from 'react';
import LOADING_MODE from '../../common/constants/loadingMode';
import LAZY_LOAD from '../../common/constants/lazyLoad';
import { GalleryComponent } from '../galleryComponent';
import { isSEOMode } from '../../common/window/viewModeWrapper';
import { URL_TYPES, URL_SIZES } from '../../common/constants/urlTypes';
import utils from '../../common/utils';

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
      lazyLoad,
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
    const imageContainer = renderer => {
      return (
        <div
          className={imageItemClassName}
          onTouchStart={actions.handleItemMouseDown}
          onTouchEnd={actions.handleItemMouseUp}
          key={'image_container-' + id}
          data-hook={'image-item'}
          style={displayed ?
            (imageDimensions.borderRadius ? { borderRadius: imageDimensions.borderRadius } : {})
            : { ...backgroundStyle, ...restOfDimensions }}
        >
          {renderer()}
        </div>
      );
    };
    const image = () => {
      const usePreload = ((!this.isTransparent || utils.isSSR()) && !this.isDimensionless);
      let preload = null;
      if (usePreload) {
        switch (styleParams.imageLoadingMode) {
          case LOADING_MODE.BLUR:
            preload = <img
              alt=''
              className={'gallery-item-visible gallery-item gallery-item-preloaded'}
              key='gallery-item-image-img-preload'
              data-hook='gallery-item-image-img-preload'
              src={createUrl(URL_SIZES.RESIZED, isSEOMode() ? URL_TYPES.SEO : URL_TYPES.LOW_RES)}
              loading="lazy"
              style={{ ...restOfDimensions, backgroundSize: '0.3px', backgroundRepeat: 'repeat' }}
              {...imageProps}
            />
            break;
          case LOADING_MODE.MAIN_COLOR:
            preload = <img
              alt=''
              key='gallery-item-image-img-preload'
              className={'gallery-item-visible gallery-item gallery-item-preloaded'}
              data-hook='gallery-item-image-img-preload'
              src={createUrl(URL_SIZES.PIXEL, isSEOMode() ? URL_TYPES.SEO : URL_TYPES.LOW_RES)}
              loading="lazy"
              style={restOfDimensions}
              {...imageProps}
            />
            break;
        }
      }

      return [preload,

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
          onLoad={node => node.target.style.opacity = '1'}
          style={restOfDimensions}
          {...imageProps}
        />
      ]

    }

    const canvas = () => (
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
