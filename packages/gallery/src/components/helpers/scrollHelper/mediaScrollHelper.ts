import {
  GALLERY_CONSTS,
  PlayTrigger,
  optionsMap,
  window,
} from 'pro-gallery-lib';
import {
  isWithinPaddingVertically,
  isWithinPaddingHorizontally,
} from './scrollHelper.js';
import {
  SetItemIdx,
  UpdateGalleryData,
  SetScroll,
  Scroll,
  HandleEvents,
  GetPlayTrigger,
} from './types';

const VIDEO_EVENTS = {
  SCROLL: 'SCROLL',
  CLICKED: 'CLICKED',
  HOVERED: 'HOVERED',
  ENDED: 'ENDED',
  INIT_SCROLL: 'INIT_SCROLL',
};

class VideoScrollHelper {
  scrollBase = 0;
  items: any[] = [];
  currentPlayingIdx = -1;
  currentItemCount = 0;
  playing = false;
  playTrigger?: PlayTrigger;
  scrollDirection?: string;
  lastVideoPlayed = -1;
  itemRatingMap = new Map();
  trigger = Object.assign(
    {},
    ...Object.keys(VIDEO_EVENTS).map((key) => ({
      [key]: (args) => this.handleEvent({ eventName: key, eventData: args }),
    }))
  );
  galleryWidth?: number;
  videoLoop?: boolean;
  top!: number;
  left!: number;
  constructor(
    public setPlayingItem: SetItemIdx,
    public readonly isItemSupported: (item: any) => boolean,
    public readonly getPlayTrigger: GetPlayTrigger
  ) {}

  //--------------------------updates----------------------------------//
  updateGalleryStructure: UpdateGalleryData = ({
    galleryStructure,
    galleryWidth,
    scrollBase,
    options,
  }) => {
    this.galleryWidth = galleryWidth;
    this.scrollBase = scrollBase;
    this.playTrigger = this.getPlayTrigger(options);
    this.videoLoop = options.behaviourParams_item_video_loop;
    this.scrollDirection = options.layoutParams_structure_scrollDirection;
    this.currentItemCount = galleryStructure.galleryItems.length;
    this.items = [];
    galleryStructure.galleryItems.forEach((item) => {
      if (this.isItemSupported(item)) {
        if (!this.itemRatingMap.has(item.id)) {
          this.itemRatingMap.set(item.id, item.idx);
        }
        this.items.push(item);
      }
    });
  };

  //--------------------------triggers--------------------------------//

  handleEvent: HandleEvents = ({ eventName, eventData }) => {
    switch (eventName) {
      case VIDEO_EVENTS.SCROLL:
        this.onScroll(eventData);
        break;
      case GALLERY_CONSTS.events.ITEM_ACTION_TRIGGERED:
        //case VIDEO_EVENTS.clicked:
        this.itemClicked(eventData.idx);
        break;
      case GALLERY_CONSTS.events.VIDEO_PAUSED:
        if (this.currentPlayingIdx === eventData.idx) {
          this.stop(eventData.idx);
        }
        break;
      case GALLERY_CONSTS.events.HOVER_SET:
        //case VIDEO_EVENTS.hovered:
        this.itemHovered(eventData);
        break;
      case GALLERY_CONSTS.events.VIDEO_ENDED:
        //case VIDEO_EVENTS.ended:
        this.videoEnded(eventData.idx);
        break;
      case GALLERY_CONSTS.events.VIDEO_PLAYED:
        //case VIDEO_EVENTS.ended:
        this.videoPlayed(eventData.idx);
        break;
      case GALLERY_CONSTS.events.VIDEO_ERROR:
        //case VIDEO_EVENTS.ended:
        this.videoErrorReported();
        break;
      case VIDEO_EVENTS.INIT_SCROLL:
        break;
      default:
    }
  };

  shouldTriggerAction = (
    idx: number,
    action: PlayTrigger = 'HOVER'
  ): boolean => {
    return this.findItem(idx) && this.shouldTrigger(action);
  };

  itemHovered: SetItemIdx = (idx) => {
    this.shouldTriggerAction(idx, 'HOVER') && this.play(idx);
  };

  itemClicked: SetItemIdx = (idx) => {
    if (!this.shouldTriggerAction(idx, 'CLICK')) {
      return;
    }
    if (this.currentPlayingIdx === idx) {
      this.stop(idx);
    } else {
      this.play(idx);
    }
  };

  onScroll: SetScroll = ({ top, left }) => {
    this.top = top >= 0 ? top : this.top;
    this.left = left >= 0 ? left : this.left;
    if (this.currentPlayingIdx === -1) {
      this.autoPlayNextItemByRating({ top: this.top, left: this.left });
    } else {
      if (!this.isCurrentItemStillVisible({ top: this.top, left: this.left })) {
        this.stop(this.currentPlayingIdx);
      }
      this.autoPlayNextItemByRating({ top: this.top, left: this.left });
    }
  };

  videoEnded: SetItemIdx = (idx) => {
    this.stop(idx);
    const scroll = { top: this.top, left: this.left };
    this.autoPlayNextItemByRating(scroll);
  };

  videoPlayed: SetItemIdx = (idx) => {
    if (this.currentPlayingIdx !== idx && !this.findItem(idx)) {
      this.play(idx);
    }
    this.lastVideoPlayed = idx;
  };

  videoErrorReported = (): void => {
    this.stop();
  };

  initializePlayState = (): void => {
    this.autoPlayNextItemByRating({ top: this.top, left: this.left });
  };

  //-------------------------------controls------------------------------------//

  autoPlayNextItemByRating: SetScroll = ({ top, left }) => {
    if (!this.shouldTrigger('AUTO')) {
      return;
    }

    const secondBestRating = {
      idx: -1,
      rating: Infinity,
    };
    const bestRating = {
      idx: -1,
      rating: Infinity,
    };
    this.items.some((item) => {
      if (this.isVisible(item, { top, left })) {
        const itemRating = this.itemRatingMap.get(item.id);
        if (itemRating <= bestRating.rating) {
          secondBestRating.idx = bestRating.idx;
          secondBestRating.rating = bestRating.rating;
          bestRating.idx = item.idx;
          bestRating.rating = itemRating;
        } else if (itemRating <= secondBestRating.rating) {
          secondBestRating.idx = item.idx;
          secondBestRating.rating = itemRating;
        }
        return false;
      } else {
        if (bestRating.idx >= 0) {
          return true;
        }
        return false;
      }
    });
    if (bestRating.idx >= 0) {
      if (!this.videoLoop && bestRating.idx === this.lastVideoPlayed) {
        if (secondBestRating.idx >= 0) {
          this.play(secondBestRating.idx); //play 2nd in line instead. keep best rating for next by the score he got...
        } else {
          return; //cant play same video twice.
        }
      } else {
        this.play(bestRating.idx);
      }
    } else {
      this.lastVideoPlayed = -2; //if there are no videos to play. we can reset this mechanism so that one-video galleries can keep playing the same video
    }
  };

  play: SetItemIdx = (idx) => {
    this.setPlayingIdx(idx);
    this.playing = true;
  };

  stop = (idx = this.currentPlayingIdx): void => {
    const item = this.findItem(idx);
    if (item) {
      const newRating = this.itemRatingMap.get(item.id) + this.currentItemCount;
      this.itemRatingMap.set(item.id, newRating);
    }
    this.setPlayingIdx(-1);
    this.playing = false;
  };

  onPlayingIdxChange = (): void => {
    this.setPlayingItem(this.currentPlayingIdx);
  };
  //-------------------------------get/set----------------------------------------//

  setPlayingIdx: SetItemIdx = (idx) => {
    if (this.currentPlayingIdx !== idx) {
      this.currentPlayingIdx = idx;
      this.onPlayingIdxChange();
    }
  };

  //-----------------------------Utils--------------------------------------------//

  isCurrentItemStillVisible = ({ top, left }: Scroll): boolean => {
    const currentItemPlacement = this.findItem(this.currentPlayingIdx);
    if (!currentItemPlacement) {
      return false;
    }
    return this.isVisible(currentItemPlacement, { top, left });
  };
  isVisible = (item: any, { top, left }: Scroll): boolean => {
    const target = {
      offsetTop: this.scrollBase || 0,
      scrollY: top,
      scrollLeft: left,
    };
    const itemPlayVerticalTolerance =
      (item.offset.top - item.offset.bottom) / 2;
    const itemPlayHorizontalTolerance =
      (item.offset.left - item.offset.right) / 2;
    const visibleVertically = isWithinPaddingVertically({
      target,
      scrollBase: this.scrollBase,
      top: item.offset.top,
      bottom: item.offset.top + item.style.height,
      screenHeight: window && window.innerHeight,
      padding: itemPlayVerticalTolerance,
    });
    let visibleHorizontally;
    if (
      this.scrollDirection ===
      GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL
    ) {
      visibleHorizontally = true;
    } else {
      visibleHorizontally = isWithinPaddingHorizontally({
        target,
        left: item.offset.left,
        right: item.offset.left + item.style.width,
        screenWidth: this.galleryWidth || (window && window.innerWidth),
        padding: itemPlayHorizontalTolerance,
      });
    }
    return visibleVertically && visibleHorizontally;
  };
  shouldTrigger = (action: PlayTrigger): boolean => {
    return this.playTrigger === action;
  };
  findItem = (idx: number): any => {
    return this.items.find((item) => item.idx === idx);
  };
}

export default VideoScrollHelper;
