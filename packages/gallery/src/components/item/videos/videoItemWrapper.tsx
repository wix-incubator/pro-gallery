import React from 'react';
import { utils, isEditMode, optionsMap } from 'pro-gallery-lib';
import { shouldCreateVideoPlaceholder } from '../itemHelper';
import { VideoPlayButton } from '../../helpers/play-button';
import MediaImage, {
  MediaImplementationProps,
  MediaBaseProps,
} from '../media/mediaItem';

const isIos = utils.isiOS();
const useTransparentPlayButtonAndForceLoadVideo = (props) =>
  (props.videoUrl || props.url).includes('youtube.com') && isIos;

const VideoItem = React.lazy(() => {
  return import(/* webpackChunkName: "proGallery_videoItem" */ './videoItem');
});

class VideoItemImplementation extends React.Component<MediaImplementationProps> {
  render() {
    if (isEditMode()) {
      return this.props.thumbnail;
    }
    const shouldForceLoadVideo = useTransparentPlayButtonAndForceLoadVideo(
      this.props
    );
    return (
      <VideoItem
        {...this.props}
        loadVideo={this.props.shouldPlay || shouldForceLoadVideo}
        videoPlaceholder={this.props.thumbnail}
        videoPlayButton={this.props.showPlayButton && <VideoPlayButton />}
      />
    );
  }
}

export type VideoWreapperProps = Omit<
  MediaBaseProps,
  | 'MediaImplementation'
  | 'enableImagePlaceholder'
  | 'showPlayButton'
  | 'placeholderExtraClasses'
>;

class VideoItemWrapper extends React.Component<VideoWreapperProps> {
  render(): React.ReactNode {
    const showVideoPlayButton =
      this.props.options[
        optionsMap.behaviourParams.item.video.enablePlayButton
      ];
    return (
      <MediaImage
        {...this.props}
        MediaImplementation={VideoItemImplementation}
        enableImagePlaceholder={shouldCreateVideoPlaceholder(
          this.props.options
        )}
        showPlayButton={showVideoPlayButton}
        placeholderExtraClasses={['video-item', 'gallery-item-video']}
      />
    );
  }
}

export default VideoItemWrapper;
/* eslint-enable prettier/prettier */
