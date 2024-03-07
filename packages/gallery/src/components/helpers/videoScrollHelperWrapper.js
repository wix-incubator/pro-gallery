import { isEditMode } from 'pro-gallery-lib';

class VideoScrollHelperWrapper {
  constructor(setPlayingIdxState) {
    this.left = 0;
    this.top = 0;
    this.setPlayingIdxState = setPlayingIdxState;
    this.handleEvent = () => {};
    this.onScroll = this.onScroll.bind(this);
    this.trigger = {
      SCROLL: this.onScroll,
      INIT_SCROLL: () => {},
    };
    this.stop = () => {};
    this.initializePlayState = () => {};
  }
  onScroll({ top, left }) {
    this.top = top || this.top;
    this.left = left || this.left;
  }
  initVideoScrollHelperIfNeeded(galleryStructureData, items) {
    if (
      items.some(
        (item) =>
          (item.metaData && item.metaData.type === 'video') ||
          (item.metadata && item.metadata.type === 'video')
      )
    ) {
      const videoScrollHelperConfig = {
        setPlayingVideos: isEditMode() ? () => {} : this.setPlayingIdxState,
      };
      import(
        /* webpackChunkName: "proGallery_videoScrollHelper" */ './videoScrollHelper.js'
      )
        .then((VideoScrollHelper) => {
          Object.assign(
            this,
            new VideoScrollHelper.default(videoScrollHelperConfig)
          );
          this.updateGalleryStructure(galleryStructureData);
          this.onScroll({ top: this.top, left: this.left });
        })
        .catch((e) => {
          console.error('Failed to load videoScrollHelper. error: ' + e);
        });
    }
  }

  updateGalleryStructure(
    scrollHelperNewGalleryStructure,
    shouldTryToInit,
    items
  ) {
    if (shouldTryToInit) {
      this.initVideoScrollHelperIfNeeded(
        scrollHelperNewGalleryStructure,
        items
      );
    }
  }
}

export default VideoScrollHelperWrapper;
