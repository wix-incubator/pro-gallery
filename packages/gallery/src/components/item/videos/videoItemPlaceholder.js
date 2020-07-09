import React from 'react';
import ImageItem from '../imageItem';


class VideoItemPlaceholder extends ImageItem {
  constructor(props) {
    super(props)
  }
  
  render() {
    const {
      imageDimensions,
      id,
      actions,
      videoControls
    } = this.props;

    const VideoPlaceholderContainerClassnames = this.getImageContainerClassNames() + ' video-item gallery-item-video'
    return (
      <div
        className={VideoPlaceholderContainerClassnames}
        onTouchStart={actions.handleItemMouseDown}
        onTouchEnd={actions.handleItemMouseUp}
        key={'image_container-' + id}
        data-hook={'image-item'}
        style={imageDimensions.borderRadius ? {borderRadius: imageDimensions.borderRadius} : {}}
      >
        {this.getImageElement()}
        {videoControls}
      </div>
    );
  }
}

export default VideoItemPlaceholder;
