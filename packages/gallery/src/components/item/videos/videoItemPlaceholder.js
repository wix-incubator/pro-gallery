import ImageItem from '../imageItem';

class VideoItemPlaceholder extends ImageItem {
  render() {
    const { videoControls } = this.props;

    const VideoPlaceholderContainerClassnames =
      this.getImageContainerClassNames() + ' video-item gallery-item-video';
    const videoPlaceholderImageRenderer = this.getImageElement();
    const renderedItem = this.getImageContainer(
      videoPlaceholderImageRenderer,
      VideoPlaceholderContainerClassnames,
      videoControls
    );

    return renderedItem;
  }
}

export default VideoItemPlaceholder;
