/* eslint-disable prettier/prettier */
import React from 'react';

import { utils, isEditMode, GALLERY_CONSTS } from 'pro-gallery-lib';
import { shouldCreateVideoPlaceholder } from '../itemHelper';
import PlayBackground from '../../svgs/components/play_background';
import PlayTriangle from '../../svgs/components/play_triangle';
import VideoItemPlaceholder from './videoItemPlaceholder';

const videoPlayButton = (
  <div>
    <i
      key="play-triangle"
      data-hook="play-triangle"
      className={'gallery-item-video-play-triangle play-triangle '}
    >
      <PlayTriangle />
    </i>
    <i
      key="play-bg"
      data-hook="play-background"
      className={'gallery-item-video-play-background play-background '}
    >
      <PlayBackground />
    </i>
  </div>
);

class VideoItemWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.mightPlayVideo = this.mightPlayVideo.bind(this);
    this.createVideoPlaceholder=
      this.createVideoPlaceholder.bind(this);
    this.state = { VideoItemLoaded: false };
  }

  mightPlayVideo() {
    const { itemClick } = this.props.options;
    const videoPlay = this.props.options.behaviourParams.item.video.playTrigger
    const { hasLink } = this.props;
    if (this.props.isVideoPlaceholder) {
      return false;
    }
    if (videoPlay === GALLERY_CONSTS.videoPlay.HOVER || videoPlay === GALLERY_CONSTS.videoPlay.AUTO) {
      return true;
    } else if (itemClick === 'nothing') {
      return true;
    } else if (itemClick === 'link' && !hasLink) {
      return true;
    }
    // }
    return false;
  }

  createVideoPlaceholder(showVideoPlayButton) {
    const props = utils.pick(this.props, [
      'alt',
      'title',
      'description',
      'id',
      'idx',
      'options',
      'createUrl',
      'settings',
      'actions',
    ]);

    return (
      <VideoItemPlaceholder
        {...props}
        key="videoPlaceholder"
        imageDimensions={this.props.imageDimensions}
        isThumbnail={!!this.props.thumbnailHighlightId}
        id={this.props.idx}
        videoPlayButton={
          showVideoPlayButton && !this.mightPlayVideo() && videoPlayButton
        }
      />
    );
  }

  async componentDidMount() {
    if (!isEditMode()) {
      try {
        const VideoItem = await import(
          /* webpackChunkName: "proGallery_videoItem" */ './videoItem'
        );
        this.VideoItem = VideoItem.default;
        if (this.mightPlayVideo()) {
          this.setState({ VideoItemLoaded: true });
        }
      } catch (e) {
        console.error('Failed to fetch VideoItem');
      }
    }
  }

  render() {
    const hover = this.props.hover;
    const showVideoPlayButton =
      !this.props.hidePlay && this.props.options.showVideoPlayButton;
    const videoPlaceholder = this.createVideoPlaceholder(showVideoPlayButton);

    const VideoItem = this.VideoItem;
    if (!this.mightPlayVideo() || !VideoItem) {
      return (
        <div>
          {shouldCreateVideoPlaceholder(this.props.options) && videoPlaceholder}
          {hover}
        </div>
      );
    }
    return (
      <VideoItem
        {...this.props}
        videoPlaceholder={videoPlaceholder}
        videoPlayButton={showVideoPlayButton && videoPlayButton}
      />
    );
  }
}

export default VideoItemWrapper;
/* eslint-enable prettier/prettier */
