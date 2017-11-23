import React from 'react';
import utils from '../../../utils';

class VideoItemPlaceholder extends React.Component {

  render() {
    const baseClassName = 'gallery-item-visible gallery-item-preloaded gallery-item-video gallery-item';
    return <div key={'video-and-hover-container' + this.props.id}>
              <div className={baseClassName} key={'video-placeholder-container-' + this.props.id}
                style={utils.deviceHasMemoryIssues() ? {} : {backgroundImage: `url(${this.props.resized_url.thumb})`}}>
                {this.props.hover}
                <div className="gallery--placeholder-item" key={'video-' + this.props.id} />
              </div>
            </div>;
  }
}

export default VideoItemPlaceholder;
