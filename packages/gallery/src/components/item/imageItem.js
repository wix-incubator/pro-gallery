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

    this.state = {
      isHighResImageLoaded: false,
      shouldReRenderAfterMount: utils.isSSR()
    }

    this.removeLowResImageTimeoutId = undefined;
    this.handleHighResImageLoad = this.handleHighResImageLoad.bind(this);
  }

  componentDidMount() {
    const { shouldReRenderAfterMount} = this.state;

    if (shouldReRenderAfterMount && !utils.isSSR()){
      this.setState({ shouldReRenderAfterMount: false})
    }
    
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
    const { isHighResImageLoaded } = this.state;
    const imageProps =
      settings &&
        settings.imageProps &&
        typeof settings.imageProps === 'function'
        ? settings.imageProps(id)
        : {};

    const { marginLeft, marginTop, ...restOfDimensions } =
      imageDimensions || {};
    const useImageTag = true;// lazyLoad === LAZY_LOAD.NATIVE || isSEOMode();
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
          style={imageDimensions.borderRadius ? { borderRadius: imageDimensions.borderRadius } : {}}
        >
          {renderer()}
        </div>
      );
    };

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
        switch (styleParams.imageLoadingMode) {
          case LOADING_MODE.BLUR:
            preload = <img
              alt=''
              key={'image_preload_blur-' + id}
              src={createUrl(URL_SIZES.RESIZED, isSEOMode() ? URL_TYPES.SEO : URL_TYPES.LOW_RES)}
              style={{ ...restOfDimensions, backgroundSize: '0.3px', backgroundRepeat: 'repeat', transition: 'all 3s ease-in-out' }}
              {...preloadProps}
            />
            break;
          case LOADING_MODE.MAIN_COLOR:
            preload = <img
              alt=''
              key={'image_preload_main_color-' + id}
              src={createUrl(URL_SIZES.PIXEL, isSEOMode() ? URL_TYPES.SEO : URL_TYPES.LOW_RES)}
              style={restOfDimensions}
              {...preloadProps}
            />
            break;
        }

        imagesComponents.push(preload);
      }

      if (!isPrerenderMode() && !utils.isSSR()) {
        const highres = <img
          key={'image_highres-' + id}
          className={'gallery-item-visible gallery-item gallery-item-hidden gallery-item-preloaded'}
          data-hook='gallery-item-image-img'
          alt={alt ? alt : 'untitled image'}
          src={createUrl(URL_SIZES.RESIZED, isSEOMode() ? URL_TYPES.SEO : URL_TYPES.HIGH_RES)}
          loading="lazy"
          onError={() => this.props.actions.setItemError()}
          onLoad={this.handleHighResImageLoad}
          style={restOfDimensions}
          {...imageProps}
        />;

        imagesComponents.push(highres)
      }
            
      return imagesComponents;
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
    // const renderedItem = imageContainer(image);
    return renderedItem;
  }
}
