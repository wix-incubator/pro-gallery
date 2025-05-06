import React from 'react';
import { GALLERY_CONSTS, optionsMap, utils } from 'pro-gallery-lib';
import ImageRenderer from './imageRenderer.js';

class ImageItem extends React.Component {
  constructor(props) {
    super(props);
    this.getImageContainer = this.getImageContainer.bind(this);
    this.getImageContainerClassNames = this.getImageContainerClassNames.bind(this);

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
    const { isCurrentHover, options } = this.props;
    const { isHighResImageLoaded } = this.state;

    const imageContainerClassNames = [
      'gallery-item-content',
      isCurrentHover ? 'item-content-hover' : 'item-content-regular',
      'image-item',
      'gallery-item-visible',
      'gallery-item',
      'gallery-item-preloaded',
      options[optionsMap.layoutParams.crop.enable] &&
      options[optionsMap.layoutParams.crop.method] === GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FIT
        ? 'grid-fit'
        : '',
      options[optionsMap.behaviourParams.item.content.loader] ===
      GALLERY_CONSTS[optionsMap.behaviourParams.item.content.loader].COLOR
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
    const { imageDimensions, options, createUrl, id } = this.props;

    let imageAnimationUrl = null;
    switch (options[optionsMap.behaviourParams.gallery.scrollAnimation]) {
      case GALLERY_CONSTS[optionsMap.behaviourParams.gallery.scrollAnimation].BLUR:
        imageAnimationUrl = createUrl(GALLERY_CONSTS.urlSizes.RESIZED, GALLERY_CONSTS.urlTypes.LOW_RES);
        break;
      case GALLERY_CONSTS[optionsMap.behaviourParams.gallery.scrollAnimation].MAIN_COLOR:
        imageAnimationUrl = createUrl(GALLERY_CONSTS.urlSizes.PIXEL, GALLERY_CONSTS.urlTypes.HIGH_RES);
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
    const { alt, imageDimensions, createUrl, id, idx, settings = {}, options } = this.props;
    const { isHighResImageLoaded } = this.state;
    const imageProps =
      settings && settings.imageProps && typeof settings.imageProps === 'function' ? settings.imageProps(id) : {};

    // eslint-disable-next-line no-unused-vars
    const { marginLeft, marginTop, ...imageSizing } = imageDimensions;

    const image = () => {
      const imagesComponents = [];
      const altText = typeof alt === 'string' ? alt : 'untitled image';
      const blockDownloadStyles =
        utils.isMobile() && this.props.options[optionsMap.behaviourParams.gallery.blockContextMenu]
          ? {
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
            }
          : {};

      const preloadStyles = this.props.isPrerenderMode
        ? {
            width: '100%',
            height: '100%',
          }
        : {};
      if (!isHighResImageLoaded) {
        let preload = null;
        const preloadProps = {
          className: 'gallery-item-visible gallery-item gallery-item-preloaded',
          key: 'gallery-item-image-img-preload',
          'data-hook': 'gallery-item-image-img-preload',
          loading: 'eager',
          ...imageProps,
        };
        switch (options[optionsMap.behaviourParams.item.content.loader]) {
          case GALLERY_CONSTS[optionsMap.behaviourParams.item.content.loader].BLUR:
            preload = (
              <ImageRenderer
                alt={altText}
                key={'image_preload_blur-' + id}
                src={createUrl(GALLERY_CONSTS.urlSizes.RESIZED, GALLERY_CONSTS.urlTypes.LOW_RES)}
                style={{
                  ...imageSizing,
                  ...preloadStyles,
                  ...blockDownloadStyles,
                }}
                {...preloadProps}
                customImageRenderer={this.props.customComponents?.customImageRenderer}
              />
            );
            break;
          case GALLERY_CONSTS[optionsMap.behaviourParams.item.content.loader].MAIN_COLOR:
            preload = (
              <ImageRenderer
                alt={altText}
                key={'image_preload_main_color-' + id}
                src={createUrl(GALLERY_CONSTS.urlSizes.PIXEL, GALLERY_CONSTS.urlTypes.HIGH_RES)}
                style={{
                  ...imageSizing,
                  ...preloadStyles,
                  ...blockDownloadStyles,
                }}
                {...preloadProps}
                customImageRenderer={this.props.customComponents?.customImageRenderer}
              />
            );
            break;
        }

        imagesComponents.push(preload);
      }

      const shouldRenderHighResImages = !this.props.isPrerenderMode;
      const imageType =
        options[optionsMap.stylingParams.itemResolutionMode] ===
        GALLERY_CONSTS[optionsMap.stylingParams.itemResolutionMode].FULL
          ? GALLERY_CONSTS.urlSizes.FULL
          : GALLERY_CONSTS.urlSizes.MULTI;
      const src = createUrl(imageType, GALLERY_CONSTS.urlTypes.HIGH_RES);

      const highres = (
        <ImageRenderer
          key={'image_highres-' + id}
          className={`gallery-item-visible gallery-item gallery-item-preloaded`}
          data-hook="gallery-item-image-img"
          data-idx={idx}
          src={src}
          alt={altText}
          onLoad={this.handleHighResImageLoad}
          loading={this.props.isPrerenderMode ? 'lazy' : 'eager'}
          style={{
            ...imageSizing,
            ...blockDownloadStyles,
            ...(!shouldRenderHighResImages && preloadStyles),
          }}
          {...imageProps}
          customImageRenderer={this.props.customComponents?.customImageRenderer}
        />
      );

      imagesComponents.push(highres);

      return imagesComponents;
    };

    return image;
  }

  render() {
    const imageRenderer = this.getImageElement();
    const imageContainerClassNames = `${this.getImageContainerClassNames()} ${this.props.extraClasses || ''}`;
    const animationOverlay = this.props.overlay || this.getImageAnimationOverlay();

    const renderedItem = this.getImageContainer(imageRenderer, imageContainerClassNames, animationOverlay);
    return renderedItem;
  }
}
/* eslint-enable prettier/prettier */
export default ImageItem;
