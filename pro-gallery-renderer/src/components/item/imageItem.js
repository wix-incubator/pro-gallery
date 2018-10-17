import React from 'react';
import utils from '../../utils/index.js';

export default class ImageItem extends React.Component {

  render() {
    const {isThumbnail, alt, visible, loaded, styleParams, imageDimensions, resized_url, id, actions, settings} = this.props;
    const imageProps = (settings && settings.imageProps && (typeof settings.imageProps === 'function')) ? settings.imageProps(id) : {};
    if (visible) {
      return <div
        className={'image-item gallery-item-visible gallery-item gallery-item-preloaded ' + ((styleParams.cubeImages && styleParams.cubeType === 'fit') ? ' grid-fit ' : '') + (loaded ? 'gallery-item-loaded' : '')}
        onTouchStart={actions.handleItemMouseDown}
        onTouchEnd={actions.handleItemMouseUp}
        key={'image_container-' + id}
        data-hook={'image-item'}
        style={utils.deviceHasMemoryIssues() ? {} : {backgroundImage: `url(${resized_url.thumb})`}}
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
        {isThumbnail ? false : <div className="pro-circle-preloader" key={'image-preloader-' + id} />}
      </div>;
    } else {
      return <div
        className={'image-item gallery-item-visible gallery-item gallery-item-preloaded ' + ((styleParams.cubeImages && styleParams.cubeType === 'fit') ? ' grid-fit ' : '') + (loaded ? 'gallery-item-loaded' : '')}
        key={'image_container-' + id}
        style={utils.deviceHasMemoryIssues() ? {} : {backgroundImage: `url(${resized_url.thumb})`}}
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
