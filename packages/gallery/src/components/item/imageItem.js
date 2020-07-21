import React from 'react';
import LOADING_MODE from '../../common/constants/loadingMode';
import { GalleryComponent } from '../galleryComponent';
import { isSEOMode, isPrerenderMode } from '../../common/window/viewModeWrapper';
import { URL_TYPES, URL_SIZES } from '../../common/constants/urlTypes';
import utils from '../../common/utils';

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
    this.props.actions.setItemLoaded();
    target.style.opacity = '1';
    this.removeLowResImageTimeoutId = setTimeout((() => {
      this.setState({ isHighResImageLoaded: true});
      this.removeLowResImageTimeoutId = undefined;
    }), BLURRY_IMAGE_REMOVAL_ANIMATION_DURATION);
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
      styleParams.imageLoadingMode === LOADING_MODE.COLOR
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
          case LOADING_MODE.BLUR:
            const imageStyles = { 
              ...restOfDimensions, 
              backgroundSize: '0.3px', 
              backgroundRepeat: 'repeat', 
              transition: 'all 3s ease-in-out'
            };
            preload = <img
              alt=''
              key={'image_preload_blur-' + id}
              src={createUrl(URL_SIZES.RESIZED, isSEOMode() ? URL_TYPES.SEO : URL_TYPES.LOW_RES)}
              style={{...imageStyles, ...preloadStyles}}
              {...preloadProps}
            />
            break;
          case LOADING_MODE.MAIN_COLOR:
            preload = <img
              alt=''
              key={'image_preload_main_color-' + id}
              src={createUrl(URL_SIZES.PIXEL, isSEOMode() ? URL_TYPES.SEO : URL_TYPES.LOW_RES)}
              style={{...restOfDimensions, ...preloadStyles}}
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
          className={'gallery-item-visible gallery-item gallery-item-hidden gallery-item-preloaded'}
          data-hook='gallery-item-image-img'
          alt={alt ? alt : 'untitled image'}
          src={createUrl(URL_SIZES.RESIZED, isSEOMode() ? URL_TYPES.SEO : URL_TYPES.HIGH_RES)}
          loading="lazy"
          onLoad={this.handleHighResImageLoad}
          style={restOfDimensions}
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
