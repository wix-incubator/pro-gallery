import React from 'react';
import utils from '../../utils/index.js';
import Consts from 'photography-client-lib/dist/src/utils/consts';

export default class ImageItem extends React.Component {

  render() {
    const {isThumbnail, alt, visible, loaded, displayed, styleParams, imageDimensions, resized_url, id, actions, settings} = this.props;
    const imageProps = (settings && settings.imageProps && (typeof settings.imageProps === 'function')) ? settings.imageProps(id) : {};
    const backgroundStyle = (utils.deviceHasMemoryIssues() || styleParams.imageLoadingMode === Consts.loadingMode.COLOR) ? {} : {backgroundImage: `url(${resized_url.thumb})`};
    const imageItemClassName = [
      'image-item',
      'gallery-item-visible',
      'gallery-item',
      'gallery-item-preloaded',
      ...((styleParams.cubeImages && styleParams.cubeType === 'fit') ? ['grid-fit'] : []),
      ...(loaded ? ['gallery-item-loaded'] : []),
      ...(styleParams.imageLoadingMode === Consts.loadingMode.COLOR ? ['load-with-color'] : [])
    ].join(' ');

    if (visible) {
      return <div
        className={imageItemClassName}
        onTouchStart={actions.handleItemMouseDown}
        onTouchEnd={actions.handleItemMouseUp}
        key={'image_container-' + id}
        data-hook={'image-item'}
        style={displayed ? {} : backgroundStyle}
        >
        <img onLoad={actions.setItemLoaded}
          key={((styleParams.cubeImages && styleParams.cubeType === 'fill') ? 'cubed-' : '') + 'image'}
          className={'gallery-item-visible gallery-item ' + (loaded ? 'gallery-item-loaded' : 'gallery-item-hidden')}
          src={resized_url.img}
          alt={isThumbnail ? '' : alt}
          onError={actions.setItemError}
          style={imageDimensions}
          {...imageProps}
        />
        {/* {isThumbnail ? false : <div className="pro-circle-preloader" key={'image-preloader-' + id} />} */}
      </div>;
    } else {
      return <div
        className={imageItemClassName}
        key={'image_container-' + id}
        style={backgroundStyle}
        data-hook={'image-item'}
      >
        <img onLoad={actions.setItemLoaded}
             key={'image-' + id}
             className={'gallery-item-hidden gallery-item'}
             style={imageDimensions}
             alt={isThumbnail ? '' : alt}
             src=""
        />
      </div>;
    }
  }
}
