import React from 'react';
import { utils, optionsMap } from 'pro-gallery-lib';
import { shouldCreateVideoPlaceholder } from '../itemHelper.js';
import { GalleryUI } from '../media/GalleryUI.js';
import MediaImage, { MediaImplementationProps, MediaBaseProps } from '../media/mediaItem.js';

const isIos = utils.isiOS();
const useTransparentPlayButtonAndForceLoadVideo = (props) =>
  ((props.videoUrl || props.url).includes('youtube.com') || (props.videoUrl || props.url).includes('youtu.be')) &&
  isIos;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const VideoItem = React.lazy(() => {
  return import(/* webpackChunkName: "proGallery_videoItem" */ './videoItem.js');
});

class VideoItemImplementation extends React.Component<MediaImplementationProps> {
  render() {
    const shouldForceLoadVideo = useTransparentPlayButtonAndForceLoadVideo(this.props);
    return (
      <VideoItem
        {...this.props}
        loadVideo={this.props.shouldPlay || shouldForceLoadVideo}
        videoPlaceholder={this.props.thumbnail}
        videoPlayButton={this.props.showPlayButton && <GalleryUI type={'videoPlayButton'} size={60} />}
      />
    );
  }
}

export type VideoWreapperProps = Omit<
  MediaBaseProps,
  'MediaImplementation' | 'enableImagePlaceholder' | 'showPlayButton' | 'placeholderExtraClasses'
>;

class VideoItemWrapper extends React.Component<VideoWreapperProps> {
  render(): React.ReactNode {
    const showVideoPlayButton = this.props.options[optionsMap.behaviourParams.item.video.enablePlayButton];
    return (
      <MediaImage
        {...this.props}
        MediaImplementation={VideoItemImplementation}
        enableImagePlaceholder={shouldCreateVideoPlaceholder(this.props.options)}
        showPlayButton={showVideoPlayButton}
        placeholderExtraClasses={['video-item', 'gallery-item-video']}
      />
    );
  }
}

export default VideoItemWrapper;
/* eslint-enable prettier/prettier */
