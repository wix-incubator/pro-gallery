import React from 'react';
import LOADING_MODE from '../../common/constants/loadingMode';
import LAZY_LOAD from '../../common/constants/lazyLoad';
import { GalleryComponent } from '../galleryComponent';
import { isSEOMode } from '../../common/window/viewModeWrapper';
import { URL_TYPES, URL_SIZES } from '../../common/constants/urlTypes';

export default class ImageItem extends GalleryComponent {
  constructor(props) {
    super(props);
    this.getImageContainer = this.getImageContainer.bind(this);
    this.getImageContainerClassNames = this.getImageContainerClassNames.bind(this);
    this.getImageElement = this.getImageElement.bind(this);
  }

  componentDidMount() {
    try {
      if (typeof this.props.actions.setItemLoaded === 'function') {
        this.props.actions.setItemLoaded();
      }
    } catch (e) {
      console.error(e);
    }
  }

  getImageContainerClassNames() {
    const {
      styleParams,
    } = this.props;

    const imageContainerClassNames = [
      'gallery-item-content',
      'image-item',
      'gallery-item-visible',
      'gallery-item',
      'gallery-item-preloaded',
      styleParams.cubeImages && styleParams.cubeType === 'fit' ?
      'grid-fit' :
      '',
      styleParams.imageLoadingMode === LOADING_MODE.COLOR ?
      'load-with-color' :
      '',
    ].join(' ');

    return imageContainerClassNames
  }

  getImageContainer(image, classNames) {
    const {
      imageDimensions,
      id,
      actions,
    } = this.props;

    return (
      <div
        className={classNames}
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

  getImageElement() {
    const {
      alt,
      imageDimensions,
      createUrl,
      id,
      settings,
      lazyLoad,
      styleParams,
    } = this.props;
    const imageProps =
      settings &&
      settings.imageProps &&
      typeof settings.imageProps === 'function' ?
      settings.imageProps(id) : {};

    const { marginLeft, marginTop, ...restOfDimensions } =
    imageDimensions || {};
    const useImageTag = lazyLoad === LAZY_LOAD.NATIVE || isSEOMode();

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

    return useImageTag ? image : canvas
  }

  render() {
    const imageElement = this.getImageElement();
    const imageContainerClassNames = this.getImageContainerClassNames();
    const renderedItem = this.getImageContainer(imageElement, imageContainerClassNames)
    return renderedItem;
  }
}
