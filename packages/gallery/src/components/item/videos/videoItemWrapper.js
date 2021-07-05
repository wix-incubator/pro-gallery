/* eslint-disable prettier/prettier */
import React from 'react';
import { utils, isEditMode, GALLERY_CONSTS } from 'pro-gallery-lib';
import ImageItem from '../imageItem';
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

class VideoItemWrapper extends ImageItem {
  constructor(props) {
    super(props);
    this.mightPlayVideo = this.mightPlayVideo.bind(this);
    this.createVideoPlaceholderIfNeeded =
      this.createVideoPlaceholderIfNeeded.bind(this);
    this.state = { VideoItemLoaded: false };
  }

  mightPlayVideo() {
    const { videoPlay, itemClick } = this.props.styleParams;
    const { hasLink } = this.props;
    if (this.props.isVideoPlaceholder) {
      return false;
    }
    if (videoPlay === 'hover' || videoPlay === 'auto') {
      return true;
    } else if (itemClick === 'nothing') {
      return true;
    } else if (itemClick === 'link' && !hasLink) {
      return true;
    }
    // }
    return false;
  }

  createVideoPlaceholderIfNeeded(showVideoPlayButton) {
    const {styleParams} = this.props;
    const props = utils.pick(this.props, [
      'alt',
      'title',
      'description',
      'id',
      'idx',
      'styleParams',
      'createUrl',
      'settings',
      'actions',
    ]);
    const shouldCreatePlaceHolder =
      utils.isSingleItemHorizontalDisplay(styleParams) && 
      styleParams.videoPlay === GALLERY_CONSTS.videoPlay.AUTO;

    return shouldCreatePlaceHolder ? null : (
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
      !this.props.hidePlay && this.props.styleParams.showVideoPlayButton;
    const videoPlaceholder = this.createVideoPlaceholderIfNeeded(showVideoPlayButton);

    const VideoItem = this.VideoItem;
    if (!this.mightPlayVideo() || !VideoItem) {
      return (
        <div>
          {videoPlaceholder}
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
