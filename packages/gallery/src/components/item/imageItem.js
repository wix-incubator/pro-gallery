import React from 'react';
import { GALLERY_CONSTS, utils, isSEOMode, isPrerenderMode } from 'pro-gallery-lib';
import { GalleryComponent } from '../galleryComponent';

const BLURRY_IMAGE_REMOVAL_ANIMATION_DURATION = 1000;
export default class ImageItem extends GalleryComponent {
  constructor(props) {
    super(props);
    this.getImageContainer = this.getImageContainer.bind(this);
    this.getImageContainerClassNames = this.getImageContainerClassNames.bind(this);
    this.getImageElement = this.getImageElement.bind(this);

    this.state = {
      isHighResImageLoaded: false,
    }

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

  handleHighResImageLoad({ target }){
    this.removeLowResImageTimeoutId = setTimeout((() => {
      this.setState({ isHighResImageLoaded: true});
      this.removeLowResImageTimeoutId = undefined;
    }), BLURRY_IMAGE_REMOVAL_ANIMATION_DURATION);
    try {
      target.style.opacity = '1';
      this.props.actions.setItemLoaded();
    } catch (e) {
      console.error('Failed to load high res image', e);
    }
  }

  componentWillUnmount(){
    if (this.removeLowResImageTimeoutId !== undefined) {
      clearTimeout(this.removeLowResImageTimeoutId);
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
      styleParams.cubeImages && styleParams.cubeType === 'fit'
        ? 'grid-fit'
        : '',
      styleParams.imageLoadingMode === GALLERY_CONSTS.loadingMode.COLOR
        ? 'load-with-color'
        : '',
    ].join(' ');

    return imageContainerClassNames
  }

  getImageContainer(imageRenerer, classNames, extraNodes) {
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
        {imageRenerer()}
        {extraNodes}
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
      styleParams,
    } = this.props;
    const { isHighResImageLoaded } = this.state;
    const imageProps =
      settings &&
        settings.imageProps &&
        typeof settings.imageProps === 'function'
        ? settings.imageProps(id)
        : {};

    const { marginLeft, marginTop, ...restOfDimensions } =
    imageDimensions || {};
    

    const image = () => {
      const imagesComponents =[]
      const blockDownloadStyles = utils.isMobile() && !this.props.styleParams.allowContextMenu ? {
        '-webkit-user-select': 'none',
        '-webkit-touch-callout': 'none'
      } : {};

      if (!isHighResImageLoaded){
        let preload = null;
        const preloadProps = {
          className: 'gallery-item-visible gallery-item gallery-item-preloaded',
          key: 'gallery-item-image-img-preload',
          'data-hook': 'gallery-item-image-img-preload',
          loading: "lazy",
          ...imageProps
        };
        const preloadStyles = isPrerenderMode() ? {
          width: '100%',
          height: '100%',
        } : {};
        switch (styleParams.imageLoadingMode) {
          case GALLERY_CONSTS.loadingMode.BLUR:
            const imageStyles = {
              ...restOfDimensions,
              backgroundSize: '0.3px',
              backgroundRepeat: 'repeat',
            };
            preload = <img
              alt=''
              key={'image_preload_blur-' + id}
              src={createUrl(GALLERY_CONSTS.urlSizes.RESIZED, isSEOMode() ? GALLERY_CONSTS.urlTypes.SEO : GALLERY_CONSTS.urlTypes.LOW_RES)}
              style={{...imageStyles, ...preloadStyles, ...blockDownloadStyles}}
              {...preloadProps}
            />
            break;
          case GALLERY_CONSTS.loadingMode.MAIN_COLOR:
            preload = <img
              alt=''
              key={'image_preload_main_color-' + id}
              src={createUrl(GALLERY_CONSTS.urlSizes.PIXEL, isSEOMode() ? GALLERY_CONSTS.urlTypes.SEO : GALLERY_CONSTS.urlTypes.LOW_RES)}
              style={{...restOfDimensions, ...preloadStyles, ...blockDownloadStyles}}
              {...preloadProps}
            />
            break;
        }

        imagesComponents.push(preload);
      }

      const shouldRenderHighResImages = !isPrerenderMode() && !utils.isSSR();
      if (shouldRenderHighResImages) {
        const highres = <img
          key={'image_highres-' + id}
          className={`gallery-item-visible gallery-item gallery-item-preloaded ${isSEOMode() ? '' : 'gallery-item-hidden'}`}
          data-hook='gallery-item-image-img'
          alt={alt ? alt : 'untitled image'}
          src={createUrl(GALLERY_CONSTS.urlSizes.RESIZED, isSEOMode() ? GALLERY_CONSTS.urlTypes.SEO : GALLERY_CONSTS.urlTypes.HIGH_RES)}
          loading="lazy"
          onLoad={this.handleHighResImageLoad}
          style={{...restOfDimensions, ...(this.state.isHighResImageLoaded && {opacity: 1}), ...blockDownloadStyles}}
          {...imageProps}
        />;

        imagesComponents.push(highres)
      }

      return imagesComponents;
    }

    return image;
  }

  render() {
    const imageRenderer = this.getImageElement();
    const imageContainerClassNames = this.getImageContainerClassNames();
    const renderedItem = this.getImageContainer(imageRenderer, imageContainerClassNames)
    return renderedItem;
  }
}
