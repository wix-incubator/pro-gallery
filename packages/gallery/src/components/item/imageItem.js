/* eslint-disable prettier/prettier */
import React from 'react';
import { GALLERY_CONSTS, utils } from 'pro-gallery-lib';
import { GalleryComponent } from '../galleryComponent';
import ImageRenderer from './imageRenderer';

export default class ImageItem extends GalleryComponent {
  constructor(props) {
    super(props);
    this.getImageContainer = this.getImageContainer.bind(this);
    this.getImageContainerClassNames =
      this.getImageContainerClassNames.bind(this);
    this.getImageElement = this.getImageElement.bind(this);

    this.state = {
      isHighResImageLoaded: false,
    };

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

  handleHighResImageLoad() {
    this.setState({ isHighResImageLoaded: true });
    try {
      this.props.actions.setItemLoaded();
    } catch (e) {
      console.error('Failed to load high res image', e);
    }
  }

  getImageContainerClassNames() {
    const { styleParams, isTransparent } = this.props;
    const { isHighResImageLoaded } = this.state;

    const imageContainerClassNames = [
      'gallery-item-content',
      'image-item',
      'gallery-item-visible',
      'gallery-item',
      'gallery-item-preloaded',
      styleParams.cubeImages && styleParams.cubeType === 'fit'
        ? 'grid-fit'
        : '',
      styleParams.imageLoadingMode === GALLERY_CONSTS.loadingMode.COLOR && !isTransparent
        ? `load-with-color ${isHighResImageLoaded ? 'image-loaded' : ''}`
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
        style={imageDimensions}
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
      isTransparent
    } = this.props;
    const { isHighResImageLoaded } = this.state;
    const imageProps =
      settings &&
      settings.imageProps &&
      typeof settings.imageProps === 'function'
        ? settings.imageProps(id)
        : {};

    // eslint-disable-next-line no-unused-vars
    const {marginLeft, marginTop, ...imageSizing} = imageDimensions;

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

      if (!isHighResImageLoaded && gotFirstScrollEvent && !isTransparent) {
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
              <ImageRenderer
                alt=""
                key={'image_preload_blur-' + id}
                src={createUrl(
                  GALLERY_CONSTS.urlSizes.RESIZED,
                  GALLERY_CONSTS.urlTypes.LOW_RES
                )}
                style={{
                  ...imageSizing,
                  ...preloadStyles,
                  ...blockDownloadStyles,
                }}
                {...preloadProps}
              />
            );
            break;
          case GALLERY_CONSTS.loadingMode.MAIN_COLOR:
            preload = (
              <ImageRenderer
                alt=""
                key={'image_preload_main_color-' + id}
                src={createUrl(
                  GALLERY_CONSTS.urlSizes.PIXEL,
                  GALLERY_CONSTS.urlTypes.HIGH_RES
                )}
                style={{
                  ...imageSizing,
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

      const shouldRenderHighResImages = !this.props.isPrerenderMode;
      const src = 
        createUrl(
    GALLERY_CONSTS.urlSizes.MULTI,
            GALLERY_CONSTS.urlTypes.HIGH_RES
          );

      const highres = (
        <ImageRenderer
          key={'image_highres-' + id}
          className={`gallery-item-visible gallery-item gallery-item-preloaded`}
          data-hook="gallery-item-image-img"
          data-idx={idx}
          src={src}
          alt={alt ? alt : 'untitled image'}
          onLoad={this.handleHighResImageLoad}
          style={{
            ...imageSizing,
            ...blockDownloadStyles,
            ...(!shouldRenderHighResImages && preloadStyles),
          }}
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
/* eslint-enable prettier/prettier */
