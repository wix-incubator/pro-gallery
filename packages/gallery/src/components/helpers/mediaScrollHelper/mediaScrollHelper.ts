import { GALLERY_CONSTS, PlayTrigger, optionsMap, window } from 'pro-gallery-lib';
import { isWithinPaddingVertically, isWithinPaddingHorizontally } from './utils';
import { SetItemIdx, UpdateGalleryData, SetScroll, Scroll, HandleEvents, GetPlayTrigger } from './types';

class VideoScrollHelper {
  private scrollBase = 0;
  private items: any[] = [];
  private currentPlayingIdx = -1;
  private currentItemCount = 0;
  private playTrigger?: PlayTrigger;
  private scrollDirection?: string;
  private lastVideoPlayed = -1;
  private readonly itemRatingMap = new Map();
  private galleryWidth?: number;
  private videoLoop?: boolean;
  private top!: number;
  private left!: number;
  constructor(
    public setPlayingItem: SetItemIdx,
    public readonly isItemSupported: (item: any) => boolean,
    public readonly getPlayTrigger: GetPlayTrigger
  ) {}

  //--------------------------updates----------------------------------//
  public readonly updateGalleryStructure: UpdateGalleryData = ({
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

  public readonly handleEvent: HandleEvents = ({ eventName, eventData }) => {
    switch (eventName) {
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
      default:
    }
  };

  private readonly shouldTriggerAction = (idx: number, action: PlayTrigger = 'HOVER'): boolean => {
    return this.findItem(idx) && this.shouldTrigger(action);
  };

  private readonly itemHovered: SetItemIdx = (idx) => {
    this.shouldTriggerAction(idx, 'HOVER') && this.play(idx);
  };

  private readonly itemClicked: SetItemIdx = (idx) => {
    if (!this.shouldTriggerAction(idx, 'CLICK') && !this.shouldTriggerAction(idx, 'ONCLICK')) {
      return;
    }
    if (this.currentPlayingIdx === idx) {
      this.stop(idx);
    } else {
      this.play(idx);
    }
  };

  public readonly onScroll: SetScroll = ({ top, left }) => {
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

  private readonly videoEnded: SetItemIdx = (idx) => {
    this.stop(idx);
    const scroll = { top: this.top, left: this.left };
    this.autoPlayNextItemByRating(scroll);
  };

  private readonly videoPlayed: SetItemIdx = (idx) => {
    if (this.currentPlayingIdx !== idx && !this.findItem(idx)) {
      this.play(idx);
    }
    this.lastVideoPlayed = idx;
  };

  private readonly videoErrorReported = (): void => {
    this.stop();
  };

  public readonly initializePlayState = (): void => {
    this.autoPlayNextItemByRating({ top: this.top, left: this.left });
  };

  //-------------------------------controls------------------------------------//

  private readonly autoPlayNextItemByRating: SetScroll = ({ top, left }) => {
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

  private readonly play: SetItemIdx = (idx) => {
    this.setPlayingIdx(idx);
  };

  public readonly stop = (idx = this.currentPlayingIdx): void => {
    const item = this.findItem(idx);
    if (item) {
      const newRating = this.itemRatingMap.get(item.id) + this.currentItemCount;
      this.itemRatingMap.set(item.id, newRating);
    }
    this.setPlayingIdx(-1);
  };

  private readonly onPlayingIdxChange = (): void => {
    this.setPlayingItem(this.currentPlayingIdx);
  };
  //-------------------------------get/set----------------------------------------//

  private readonly setPlayingIdx: SetItemIdx = (idx) => {
    if (this.currentPlayingIdx !== idx) {
      this.currentPlayingIdx = idx;
      this.onPlayingIdxChange();
    }
  };

  //-----------------------------Utils--------------------------------------------//

  private readonly isCurrentItemStillVisible = ({ top, left }: Scroll): boolean => {
    const currentItemPlacement = this.findItem(this.currentPlayingIdx);
    if (!currentItemPlacement) {
      return false;
    }
    return this.isVisible(currentItemPlacement, { top, left });
  };
  private readonly isVisible = (item: any, { top, left }: Scroll): boolean => {
    const target = {
      offsetTop: this.scrollBase || 0,
      scrollY: top,
      scrollLeft: left,
    };
    const itemPlayVerticalTolerance = (item.offset.top - item.offset.bottom) / 2;
    const itemPlayHorizontalTolerance = (item.offset.left - item.offset.right) / 2;
    const visibleVertically = isWithinPaddingVertically({
      target,
      scrollBase: this.scrollBase,
      top: item.offset.top,
      bottom: item.offset.top + item.style.height,
      screenHeight: window && window.innerHeight,
      padding: itemPlayVerticalTolerance,
    });
    let visibleHorizontally;
    if (this.scrollDirection === GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL) {
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
  private readonly shouldTrigger = (action: PlayTrigger): boolean => {
    return this.playTrigger === action;
  };
  public readonly findItem = (idx: number): any => {
    return this.items.find((item) => item.idx === idx);
  };
}

export default VideoScrollHelper;
