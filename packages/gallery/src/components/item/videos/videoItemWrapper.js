import React from 'react';
import { utils, isEditMode } from 'pro-gallery-lib';
import { shouldCreateVideoPlaceholder } from '../itemHelper';
import VideoButtonBackground from '../../svgs/components/play_background';
import PlayTriangle from '../../svgs/components/play_triangle';
import PauseBars from '../../svgs/components/pause_bars';
import VideoItemPlaceholder from './videoItemPlaceholder';

const isIos = utils.isiOS();
const useTransparentPlayButtonAndForceLoadVideo = (props) =>
  ((props.videoUrl || props.url).includes('youtube.com') ||
    (props.videoUrl || props.url).includes('youtu.be')) &&
  isIos;

const VideoButton = ({ pointerEvents, buttonRole, buttonSvg }) => (
  <div style={{ pointerEvents: pointerEvents ? 'initial' : 'none' }}>
    <i
      key={buttonRole}
      data-hook={buttonRole}
      className={`gallery-item-video-${buttonRole} ${buttonRole} `}
    >
      {buttonSvg}
    </i>
    <i
      key="play-bg"
      data-hook="play-background"
      className={'gallery-item-video-play-background play-background '}
    >
      <VideoButtonBackground />
    </i>
  </div>
);

class VideoItemWrapper extends React.Component {
  // TO BE DELETED
  constructor(props) {
    super(props);
    this.mightPlayVideo = this.mightPlayVideo.bind(this);
    this.createVideoPlaceholder = this.createVideoPlaceholder.bind(this);
    this.state = { videoItemLoaded: false };
    this.isCompMounted = false;
  }

  mightPlayVideo() {
    const { videoPlay, itemClick } = this.props.options;
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
      'isCurrentHover',
      'customComponents',
    ]);
    const showVideoPauseButton = this.props.isCurrentHover;
    return (
      <VideoItemPlaceholder
        {...props}
        key="videoPlaceholder"
        imageDimensions={this.props.imageDimensions}
        isThumbnail={!!this.props.thumbnailHighlightId}
        id={this.props.idx}
        videoPlayButton={
          showVideoPlayButton && (
            <VideoButton
              pointerEvents={
                !useTransparentPlayButtonAndForceLoadVideo(this.props)
              }
              buttonRole={'play-triangle'}
              buttonSvg={<PlayTriangle />}
            />
          )
        }
        videoPauseButton={
          showVideoPauseButton && (
            <VideoButton
              pointerEvents={useTransparentPlayButtonAndForceLoadVideo(
                this.props
              )}
              buttonRole={'pause-bars'}
              buttonSvg={<PauseBars />}
            />
          )
        }
      />
    );
  }

  async componentDidMount() {
    this.isCompMounted = true;
    if (!isEditMode()) {
      try {
        const VideoItem = await import(
          /* webpackChunkName: "proGallery_videoItem" */ './videoItem'
        );
        this.VideoItem = VideoItem.default;
        if (this.isCompMounted) {
          this.setState({ videoItemLoaded: true });
        }
      } catch (e) {
        console.error('Failed to fetch VideoItem');
      }
    }
  }
  componentWillUnmount() {
    this.isCompMounted = false;
  }
  render() {
    const hover = this.props.hover;
    const showVideoPlayButton =
      !this.props.hidePlay && this.props.options.showVideoPlayButton;
    const showVideoPauseButton =
      this.props.isCurrentHover && this.props.options.showVideoPlayButton;
    const videoPlaceholder = this.createVideoPlaceholder(showVideoPlayButton);

    const VideoItem = this.VideoItem;
    const shouldRenderVideoPlaceholder =
      !this.mightPlayVideo() ||
      !this.state.videoItemLoaded ||
      this.props.isPrerenderMode;
    if (shouldRenderVideoPlaceholder) {
      return (
        <div>
          {shouldCreateVideoPlaceholder(this.props.options) && videoPlaceholder}
          {hover}
        </div>
      );
    }
    const shouldUseTransparentPlayButtonAndForceLoadVideo =
      useTransparentPlayButtonAndForceLoadVideo(this.props);
    return (
      <VideoItem
        {...this.props}
        loadVideo={
          this.props.loadVideo ||
          shouldUseTransparentPlayButtonAndForceLoadVideo
        }
        videoPlaceholder={videoPlaceholder}
        videoPlayButton={
          showVideoPlayButton && (
            <VideoButton
              pointerEvents={
                !useTransparentPlayButtonAndForceLoadVideo(this.props)
              }
              buttonRole={'play-triangle'}
              buttonSvg={<PlayTriangle />}
            />
          )
        }
        videoPauseButton={
          showVideoPauseButton && (
            <VideoButton
              pointerEvents={useTransparentPlayButtonAndForceLoadVideo(
                this.props
              )}
              buttonRole={'pause-bars'}
              buttonSvg={<PauseBars />}
            />
          )
        }
      />
    );
  }
}

export default VideoItemWrapper;
/* eslint-enable prettier/prettier */
