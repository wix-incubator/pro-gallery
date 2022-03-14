import React from 'react';
import ImageItem from '../imageItem';

class VideoItemPlaceholder extends React.Component {
  render() {
    return (
      <ImageItem
        overlay={this.props.videoPlayButton}
        extraClasses={' video-item gallery-item-video'}
        {...this.props}
      />
    );
  }
}

export default VideoItemPlaceholder;
