import React from 'react';
import { utils } from 'pro-gallery-lib';
import ImageItem from '../imageItem';
import PlayBackground from '../../svgs/components/play_background';
import PlayTriangle from '../../svgs/components/play_triangle';
import VideoItemPlaceholder from './videoItemPlaceholder';

const videoControls = [
  <i
    key="play-triangle"
    data-hook="play-triangle"
    className={'gallery-item-video-play-triangle play-triangle '}
  >
    <PlayTriangle />
  </i>,
  <i
    key="play-bg"
    data-hook="play-background"
    className={'gallery-item-video-play-background play-background '}
  >
    <PlayBackground />
  </i>,
];

class VideoItemWrapper extends ImageItem {
  constructor(props) {
    super(props);
    this.shouldPlayVideo = this.shouldPlayVideo.bind(this);
    this.createVideoItemPlaceholder = this.createVideoItemPlaceholder.bind(
      this
    );
    this.state = { VideoItemLoaded: false };
  }

  shouldPlayVideo() {
    const { videoPlay, itemClick } = this.props.styleParams;
    const { hasLink } = this.props;
    if (this.props.isVideoPlaceholder) {
      return false;
    }
    if (
      this.props.idx === this.props.playingVideoIdx ||
      this.props.idx === this.props.nextVideoIdx
    ) {
      if (videoPlay === 'hover' || videoPlay === 'auto') {
        return true;
      } else if (itemClick === 'nothing') {
        return true;
      } else if (itemClick === 'link' && !hasLink) {
        return true;
      }
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
      'actions',
    ]);

    return (
      <VideoItemPlaceholder
        {...props}
        key="videoPlaceholder"
        imageDimensions={this.props.imageDimensions}
        isThumbnail={!!this.props.thumbnailHighlightId}
        id={this.props.idx}
        videoControls={showVideoControls && videoControls}
      />
    );
  }

  async componentDidMount() {
    try {
      const VideoItem = await import(
        /* webpackChunkName: "proGallery_videoItem" */ './videoItem'
      );
      this.VideoItem = VideoItem.default;
      if (this.shouldPlayVideo()) {
        this.setState({ VideoItemLoaded: true });
      }
    } catch (e) {
      console.error('Failed to fetch VideoItem');
    }
  }

  render() {
    const hover = this.props.hover;
    const showVideoControls =
      !this.props.hidePlay && this.props.styleParams.showVideoPlayButton;
    const videoPlaceholder = this.createVideoItemPlaceholder(showVideoControls);

    const VideoItem = this.VideoItem;
    if (!this.shouldPlayVideo() || !VideoItem) {
      return [videoPlaceholder, hover];
    }
    return (
      <VideoItem
        {...this.props}
        videoControls={showVideoControls && videoControls}
      />
    );
  }
}

export default VideoItemWrapper;
