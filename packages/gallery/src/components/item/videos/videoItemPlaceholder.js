import ImageItem from '../imageItem';
import triggerSetItemLoaded from '../triggerSetItemLoaded';

class VideoItemPlaceholder extends ImageItem {
  render() {
    const { videoPlayButton } = this.props;

    const VideoPlaceholderContainerClassnames =
      this.getImageContainerClassNames() + ' video-item gallery-item-video';
    const videoPlaceholderImageRenderer = this.getImageElement();
    const renderedItem = this.getImageContainer(
      videoPlaceholderImageRenderer,
      VideoPlaceholderContainerClassnames,
      videoPlayButton
    );

    return renderedItem;
  }

  componentDidMount() {
    triggerSetItemLoaded(this.props);
  }
}

export default VideoItemPlaceholder;
