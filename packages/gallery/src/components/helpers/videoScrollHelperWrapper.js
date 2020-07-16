import { isEditMode } from '../../common/window/viewModeWrapper';


class VideoScrollHelperWrapper {
    constructor(setPlayingIdxState) {
        this.videoScrollHelper = null;
        this.setPlayingIdxState = setPlayingIdxState;
        this.handleEvent = () => {};
        this.trigger =  {SCROLL: () => {}, INIT_SCROLL: () => {}};
        this.stop = () => {};
        this.initializePlayState = () => {};
    }

    initVideoScrollHelperIfNeeded(galleryStructureData, items) {
        if(items.some(item => (item.metaData && item.metaData.type === "video") || (item.metadata && item.metadata.type === "video"))) {
            const videoScrollHelperConfig = {
              setPlayingVideos: isEditMode() ? () => { } : this.setPlayingIdxState,
            };
            import( /* webpackChunkName: "videoScrollHelper" */ './videoScrollHelper.js').then(VideoScrollHelper => {
              Object.assign(this, new VideoScrollHelper.default(videoScrollHelperConfig));
              this.updateGalleryStructure(galleryStructureData);
              this.initializePlayState();
            }).catch((e) => {
              console.error('Failed to load videoScrollHelper. error: ' + e)
            })
        }
    }

    updateGalleryStructure(scrollHelperNewGalleryStructure, shouldTryToInit, items) {
        if(shouldTryToInit) {
            this.initVideoScrollHelperIfNeeded(scrollHelperNewGalleryStructure, items)
        }
    }


}

export default VideoScrollHelperWrapper;