import React from 'react';
import {
  GALLERY_CONSTS,
  utils,
  isSEOMode,
} from 'pro-gallery-lib';
import { GalleryComponent } from '../galleryComponent';

const BLURRY_IMAGE_REMOVAL_ANIMATION_DURATION = 1000;
export default class ImageItem extends GalleryComponent {
  constructor(props) {
    super(props);
    this.getImageContainer = this.getImageContainer.bind(this);
    this.getImageContainerClassNames = this.getImageContainerClassNames.bind(
      this
    );
    this.getImageElement = this.getImageElement.bind(this);

    this.state = {
      isHighResImageLoaded: false,
    };

    this.removeLowResImageTimeoutId = undefined;
    this.handleHighResImageLoad = this.handleHighResImageLoad.bind(this);
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

  handleHighResImageLoad({ target }) {
    this.removeLowResImageTimeoutId = setTimeout(() => {
      this.setState({ isHighResImageLoaded: true });
      this.removeLowResImageTimeoutId = undefined;
    }, BLURRY_IMAGE_REMOVAL_ANIMATION_DURATION);
    try {
      target.style.opacity = '1';
      this.props.actions.setItemLoaded();
    } catch (e) {
      console.error('Failed to load high res image', e);
    }
  }

  componentWillUnmount() {
    if (this.removeLowResImageTimeoutId !== undefined) {
      clearTimeout(this.removeLowResImageTimeoutId);
    }
  }

  getImageContainerClassNames() {
    const { styleParams } = this.props;

    const imageContainerClassNames = [
      'gallery-item-content',
      'image-item',
      'gallery-item-visible',
      'gallery-item',
      'gallery-item-preloaded',
      styleParams.cubeImages && styleParams.cubeType === 'fit'
        ? 'grid-fit'
        : '',
      styleParams.imageLoadingMode === GALLERY_CONSTS.loadingMode.COLOR
        ? 'load-with-color'
        : '',
    ].join(' ');

    return imageContainerClassNames;
  }

  getImageContainer(imageRenderer, classNames, extraNodes) {
    const { imageDimensions, id, actions } = this.props;

    return (
      <div
        className={classNames}
        onTouchStart={actions.handleItemMouseDown}
        onTouchEnd={actions.handleItemMouseUp}
        key={'image_container-' + id}
        data-hook={'image-item'}
        style={
          imageDimensions.borderRadius
            ? { borderRadius: imageDimensions.borderRadius }
            : {}
        }
      >
        {imageRenderer()}
        {extraNodes}
      </div>
    );
  }

  getImageAnimationOverlay() {
    const { imageDimensions, styleParams, createUrl, id } = this.props;

    let imageAnimationUrl = null;
    switch (styleParams.scrollAnimation) {
      case GALLERY_CONSTS.scrollAnimations.BLUR:
        imageAnimationUrl = createUrl(
          GALLERY_CONSTS.urlSizes.RESIZED,
          GALLERY_CONSTS.urlTypes.LOW_RES
        );
        break;
      case GALLERY_CONSTS.scrollAnimations.MAIN_COLOR:
        imageAnimationUrl = createUrl(
          GALLERY_CONSTS.urlSizes.PIXEL,
          GALLERY_CONSTS.urlTypes.HIGH_RES
        );
        break;
    }

    return (
      imageAnimationUrl && (
        <div
          key={'image_container-overlay-' + id}
          data-hook={'image-item-overlay'}
          style={{
            ...imageDimensions,
            backgroundImage: `url(${imageAnimationUrl})`,
            backgroundSize: 'cover',
            pointerEvents: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        ></div>
      )
    );
  }

  getImageElement() {
    const {
      alt,
      imageDimensions,
      createUrl,
      id,
      idx,
      settings = {},
      styleParams,
      gotFirstScrollEvent,
    } = this.props;
    const { isHighResImageLoaded } = this.state;
    const imageProps =
      settings &&
      settings.imageProps &&
      typeof settings.imageProps === 'function'
        ? settings.imageProps(id)
        : {};

    // eslint-disable-next-line no-unused-vars
    const { margin, ...restOfDimensions } = imageDimensions || {};

    const image = () => {
      const imagesComponents = [];
      const blockDownloadStyles =
        utils.isMobile() && !this.props.styleParams.allowContextMenu
          ? {
              '-webkit-user-select': 'none',
              '-webkit-touch-callout': 'none',
            }
          : {};

      const preloadStyles = this.props.isPrerenderMode
        ? {
            width: '100%',
            height: '100%',
          }
        : {};

      if (
        !isHighResImageLoaded &&
        (gotFirstScrollEvent || settings.forceImagePreload)
      ) {
        let preload = null;
        const preloadProps = {
          className: 'gallery-item-visible gallery-item gallery-item-preloaded',
          key: 'gallery-item-image-img-preload',
          'data-hook': 'gallery-item-image-img-preload',
          loading: 'eager',
          ...imageProps,
        };
        switch (styleParams.imageLoadingMode) {
          case GALLERY_CONSTS.loadingMode.BLUR:
            preload = (
              <img
                alt=""
                key={'image_preload_blur-' + id}
                src={createUrl(
                  GALLERY_CONSTS.urlSizes.RESIZED,
                  GALLERY_CONSTS.urlTypes.LOW_RES
                )}
                style={{
                  ...restOfDimensions,
                  ...preloadStyles,
                  ...blockDownloadStyles,
                }}
                {...preloadProps}
              />
            );
            break;
          case GALLERY_CONSTS.loadingMode.MAIN_COLOR:
            preload = (
              <img
                alt=""
                key={'image_preload_main_color-' + id}
                src={createUrl(
                  GALLERY_CONSTS.urlSizes.PIXEL,
                  GALLERY_CONSTS.urlTypes.HIGH_RES
                )}
                style={{
                  ...restOfDimensions,
                  ...preloadStyles,
                  ...blockDownloadStyles,
                }}
                {...preloadProps}
              />
            );
            break;
        }

        imagesComponents.push(preload);
      }

      const shouldRenderHighResImages = !this.props.isPrerenderMode
      const src = createUrl(
        GALLERY_CONSTS.urlSizes.RESIZED,
        isSEOMode()
          ? GALLERY_CONSTS.urlTypes.SEO
          : GALLERY_CONSTS.urlTypes.HIGH_RES
      );
      const highres = (
        <img
          key={'image_highres-' + id}
          className={`gallery-item-visible gallery-item gallery-item-preloaded ${
            isSEOMode() ? '' : 'gallery-item-hidden'
          }`}
          data-hook="gallery-item-image-img"
          data-idx={idx}
          alt={alt ? alt : 'untitled image'}
          loading="lazy"
          onLoad={this.handleHighResImageLoad}
          style={{
            ...restOfDimensions,
            ...{ opacity: shouldRenderHighResImages ? 1 : 0 },
            ...blockDownloadStyles,
            ...(!shouldRenderHighResImages && preloadStyles),
          }}
          {...{ [shouldRenderHighResImages ? 'src' : 'data-src']: src }}
          {...imageProps}
        />
      );

      imagesComponents.push(highres);

      return imagesComponents;
    };

    return image;
  }

  render() {
    const imageRenderer = this.getImageElement();
    const imageContainerClassNames = this.getImageContainerClassNames();
    const animationOverlay = this.getImageAnimationOverlay();
    const renderedItem = this.getImageContainer(
      imageRenderer,
      imageContainerClassNames,
      animationOverlay
    );
    return renderedItem;
  }
}
