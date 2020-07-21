import React, {lazy, Suspense} from 'react';
import ImageItem from '../imageItem';
import PlayBackground from '../../svgs/components/play_background';
import PlayTriangle from '../../svgs/components/play_triangle';
import VideoItemPlaceholder from './videoItemPlaceholder'
import utils from '../../../common/utils';


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


const VideoItem = lazy(() => import(/* webpackChunkName: "videoItem" */ './videoItem'))

class VideoItemWrapper extends ImageItem {
  constructor(props) {
    super(props);
    this.canVideoPlayInGallery = this.canVideoPlayInGallery.bind(this);
    this.createVideoItemPlaceholder = this.createVideoItemPlaceholder.bind(this);

  }

  canVideoPlayInGallery() {
    const { videoPlay, itemClick } = this.props.styleParams;
    const { hasLink } = this.props;
    if (this.props.idx === this.props.playingVideoIdx ||
      this.props.idx === this.props.nextVideoIdx) {
      if (
        videoPlay === 'hover' || videoPlay === 'auto'
      ) { return true; } else if (
        itemClick === 'nothing'
      ) { return true; } else if (
        itemClick === 'link' && !hasLink
      ) { return true; }
    }
    return false;
  }
  
  createVideoItemPlaceholder(showVideoControls) {
    const props = utils.pick(this.props, [
      'alt',
      'title',
      'description',
      'id',
      'idx',
      'styleParams',
      'createUrl',
      'settings',
      'actions'
    ]);

    return <VideoItemPlaceholder
        {...props}
        key="videoPlaceholder"
        imageDimensions={this.props.imageDimensions}
        isThumbnail={!!this.props.thumbnailHighlightId}
        id={this.props.idx}
        videoControls={showVideoControls && videoControls}
      />
  }


  render() {
    const hover = this.props.hover;
    const showVideoControls = !this.props.hidePlay && this.props.styleParams.showVideoPlayButton;
    const videoPlaceholder = this.createVideoItemPlaceholder(showVideoControls)

    if (!this.canVideoPlayInGallery() || this.props.isVideoPlaceholder) {
      return [videoPlaceholder, hover]
    }

    return <Suspense fallback={[videoPlaceholder, hover]}>
            <VideoItem {...this.props} videoControls={showVideoControls && videoControls}/>
        </Suspense> 
  }
}

export default VideoItemWrapper;
