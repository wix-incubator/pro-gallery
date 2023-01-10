import React from 'react';
import { utils, isEditMode, optionsMap, GALLERY_CONSTS } from 'pro-gallery-lib';
import { shouldCreateVideoPlaceholder } from '../itemHelper';
import PlayBackground from '../../svgs/components/play_background';
import PlayTriangle from '../../svgs/components/play_triangle';
import VideoItemPlaceholder from './videoItemPlaceholder';
import { clickable } from '../../helpers/mouseCursorPosition';

const isIos = utils.isiOS();
const useTransparentPlayButtonAndForceLoadVideo = (props) =>
  (props.videoUrl || props.url).includes('youtube.com') && isIos;

const VideoPlayButton = () => (
  <clickable.div
    style={{
      cursor: 'pointer',
    }}
  >
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
  </clickable.div>
);

class VideoItemWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.mightPlayVideo = this.mightPlayVideo.bind(this);
    this.createVideoPlaceholder = this.createVideoPlaceholder.bind(this);
    this.state = { VideoItemLoaded: false };
  }

  mightPlayVideo() {
    const videoPlayTrigger =
      this.props.options[optionsMap.behaviourParams.item.video.playTrigger];
    const { hasLink } = this.props;
    if (this.props.isVideoPlaceholder) {
      return false;
    }
    if (
      videoPlayTrigger ===
        GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger]
          .HOVER ||
      videoPlayTrigger ===
        GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].AUTO
    ) {
      return true;
    } else if (
      this.props.options[optionsMap.behaviourParams.item.clickAction] ===
      GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].NOTHING
    ) {
      return true;
    } else if (
      this.props.options[optionsMap.behaviourParams.item.clickAction] ===
        GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].LINK &&
      !hasLink
    ) {
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
      'isCurrentHover',
    ]);

    return (
      <VideoItemPlaceholder
        {...props}
        key="videoPlaceholder"
        imageDimensions={this.props.imageDimensions}
        isThumbnail={!!this.props.thumbnailHighlightId}
        id={this.props.idx}
        videoPlayButton={
          showVideoPlayButton &&
          !this.mightPlayVideo() && (
            <VideoPlayButton
              pointerEvents={
                !useTransparentPlayButtonAndForceLoadVideo(this.props)
              }
            />
          )
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
      this.props.options[
        optionsMap.behaviourParams.item.video.enablePlayButton
      ];
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
            <VideoPlayButton
              pointerEvents={!shouldUseTransparentPlayButtonAndForceLoadVideo}
            />
          )
        }
      />
    );
  }
}

export default VideoItemWrapper;
/* eslint-enable prettier/prettier */
