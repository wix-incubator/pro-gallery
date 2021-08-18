import ImageItem from '../imageItem';
import { GalleryComponent } from '../../galleryComponent';

class VideoItemPlaceholder extends GalleryComponent {
  render() {
    return (
      <ImageItem
        overlay={this.props.videoPlayButton}
        extraClasses={' video-item gallery-item-video'}
        {...this.props}
      />
    );
  }
}

export default VideoItemPlaceholder;
