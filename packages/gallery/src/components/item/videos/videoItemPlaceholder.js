import React from 'react';
import { GalleryComponent } from '../../galleryComponent';
import { URL_TYPES, URL_SIZES } from '../../../common/constants/urlTypes';
import PlayBackground from '../../svgs/components/play_background';
import PlayTriangle from '../../svgs/components/play_triangle';
import LAZY_LOAD from '../../../common/constants/lazyLoad';
import { isSEOMode } from '../../../common/window/viewModeWrapper';
import ImageItem from '../imageItem';


const videoControls = [
  <i
        key="play-triangle"
        data-hook="play-triangle"
        className={
          'gallery-item-video-play-triangle play-triangle '
        }
      ><PlayTriangle/></i>,
  <i
        key="play-bg"
        data-hook="play-background"
        className={
          'gallery-item-video-play-background play-background '
        }
      ><PlayBackground/></i>,
];

class VideoItemPlaceholder extends ImageItem {
  constructor(props) {
    super(props)
  }
  
  render() {
    const {
      imageDimensions,
      id,
      actions,
      styleParams
    } = this.props;
    const showVideoControls = !this.props.hidePlay && styleParams.showVideoPlayButton;

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
        {showVideoControls && videoControls}
      </div>
    );
  }
}

export default VideoItemPlaceholder;
