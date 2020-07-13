import React from 'react';
import ImageItem from '../imageItem';


class VideoItemPlaceholder extends ImageItem {
  constructor(props) {
    super(props)
  }
  

  render() {
    const {
      videoControls
    } = this.props;

    const VideoPlaceholderContainerClassnames = this.getImageContainerClassNames() + ' video-item gallery-item-video'
    const videoPlaceholderImage = this.getImageElement();
    const renderedItem = this.getImageContainer([videoPlaceholderImage, videoControls], VideoPlaceholderContainerClassnames)

    return renderedItem
  }
}

export default VideoItemPlaceholder;
