import { isEditMode } from 'pro-gallery-lib';
import {
  HandleEvents,
  MediaScrollHelperHandlerConfiguration,
  SetItemIdx,
  SetScroll,
  UpdateGalleryData,
} from './types.js';

class MediaScrollHelper {
  left: number;
  top: number;
  private scrollHelpers: InstanceType<typeof import('./mediaScrollHelper')['default']>[] = [];
  constructor(private config: MediaScrollHelperHandlerConfiguration) {
    this.left = 0;
    this.top = 0;
  }
  stop: SetItemIdx = (idx) => {
    for (const scrollHelper of this.scrollHelpers) {
      if (scrollHelper.findItem(idx)) {
        scrollHelper.stop(idx);
      }
    }
  };
  initializePlayState = (): void => {
    for (const scrollHelper of this.scrollHelpers) {
      scrollHelper.initializePlayState();
    }
  };
  onScroll: SetScroll = ({ top, left }) => {
    if (!this.scrollHelpers.length) {
      this.top = top || this.top;
      this.left = left || this.left;
    }
    for (const scrollHelper of this.scrollHelpers) {
      scrollHelper.onScroll({ top, left });
    }
  };
  latestGalleryStructure: any;
  scrollHelperPromise: Promise<void> | undefined;
  handleEvent: HandleEvents = (event) => {
    for (const scrollHelper of this.scrollHelpers) {
      scrollHelper.handleEvent(event);
    }
  };
  updateGalleryStructure: UpdateGalleryData = (data) => {
    if (data.isSSR) {
      //TODO - This could be broken in hydrate since we use inPrerenderMode. (diff between hydrate and ssr are breaking)
      return;
    }
    for (const scrollHelper of this.scrollHelpers) {
      scrollHelper.updateGalleryStructure(data);
    }
    if (this.scrollHelperPromise) {
      this.latestGalleryStructure = data;
      return;
    }
    this.latestGalleryStructure = data;
    if (isEditMode()) {
      return;
    }
    if (!data.galleryStructure.galleryItems.some((item) => this.config.some((c) => c.supportedItemsFilter(item)))) {
      return;
    }
    this.scrollHelperPromise = import(/* webpackChunkName: "proGallery_videoScrollHelper" */ './mediaScrollHelper.js')
      .then(({ default: VideoScrollHelper }) => {
        for (const config of this.config) {
          this.scrollHelpers.push(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            new VideoScrollHelper(config.onSetPlayingIdx, config.supportedItemsFilter, config.getPlayTrigger)
          );
        }
        this.updateGalleryStructure(this.latestGalleryStructure);
        this.onScroll({ top: this.top, left: this.left });
      })
      .catch((e) => {
        console.error('Failed to load videoScrollHelper. error: ' + e);
      });
  };
}

export default MediaScrollHelper;
