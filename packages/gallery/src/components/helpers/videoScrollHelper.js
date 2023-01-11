import { GALLERY_CONSTS, optionsMap, window } from 'pro-gallery-lib';
import {
  isWithinPaddingVertically,
  isWithinPaddingHorizontally,
} from './scrollHelper';

const VIDEO_EVENTS = {
  SCROLL: 'SCROLL',
  CLICKED: 'CLICKED',
  HOVERED: 'HOVERED',
  ENDED: 'ENDED',
  INIT_SCROLL: 'INIT_SCROLL',
};

class VideoScrollHelper {
  constructor(config) {
    this.scrollBase = 0;
    this.items = [];
    this.currentPlayingIdx = -1;
    this.currentItemCount = 0;
    this.playing = false;
    this.updateGalleryStructure = this.updateGalleryStructure.bind(this);
    this.initializePlayState = this.initializePlayState.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
    this.isVisible = this.isVisible.bind(this);
    this.videoPlayTrigger = undefined;
    this.threeDPlayTrigger = undefined;
    this.setPlayingItem = config.setPlayingVideos;
    this.lastVideoPlayed = -1;
    this.itemRatingMap = new Map();
    this.trigger = Object.assign(
      {},
      ...Object.keys(VIDEO_EVENTS).map((key) => ({
        [key]: (args) => this.handleEvent({ eventName: key, eventData: args }),
      }))
    );
  }

  //--------------------------updates----------------------------------//
  updateGalleryStructure({
    galleryStructure,
    galleryWidth,
    scrollBase,
    videoPlayTrigger,
    threeDPlayTrigger,
    videoLoop,
    scrollDirection,
  }) {
    this.galleryWidth = galleryWidth;
    this.scrollBase = scrollBase;
    this.videoPlayTrigger = videoPlayTrigger;
    this.threeDPlayTrigger = threeDPlayTrigger;
    this.videoLoop = videoLoop;
    this[optionsMap.layoutParams.structure.scrollDirection] = scrollDirection;
    this.currentItemCount = galleryStructure.galleryItems.length;
    this.items = [];
    galleryStructure.galleryItems.forEach((item) => {
      if (
        item.type === 'video' ||
        (item.type === 'image' &&
          (item.id.includes('_placeholder') || item.isVideoPlaceholder)) ||
        item.type === '3d'
      ) {
        // either video or a placeholder for video files (both need to be included in the list)
        if (!this.itemRatingMap.has(item.id)) {
          this.itemRatingMap.set(item.id, item.idx);
        }
        this.items.push(item);
      }
    });
  }

  //--------------------------triggers--------------------------------//

  handleEvent({ eventName, eventData }) {
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
  }

  isTheeD(item) {
    return item.type === '3d';
  }
  isIdxTheeD(idx) {
    const item = this.items.find((item) => item.idx === idx);
    if (!item) return false;
    return this.isTheeD(item);
  }

  idxPlayTrigger(idx) {
    return this.isIdxTheeD(idx)
      ? this.threeDPlayTrigger
      : this.videoPlayTrigger;
  }

  idxAutoPlay(idx) {
    return (
      this.idxPlayTrigger(idx) ===
      GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].AUTO
    );
  }

  shouldTriggerAction(idx, action = 'HOVER') {
    if (this.findItemIndex(idx) === -1) {
      return false;
    }
    if (
      this.idxPlayTrigger(idx) !==
      GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger][action]
    ) {
      return false;
    }
    return true;
  }

  itemHovered(idx) {
    return this.shouldTriggerAction(idx, 'HOVER') && this.play(idx);
  }

  itemClicked(idx) {
    if (!this.shouldTriggerAction(idx, 'CLICK')) {
      return;
    }
    if (this.currentPlayingIdx === idx && !this.isIdxTheeD(idx)) {
      this.stop(idx);
      return;
    }
    this.play(idx);
  }

  findItemIndex(idx) {
    return this.items.findIndex((item) => item.idx === idx);
  }

  onScroll({ top, left }) {
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
  }

  videoEnded(idx) {
    this.stop(idx);
    const scroll = { top: this.top, left: this.left };
    this.autoPlayNextItemByRating(scroll);
  }

  videoPlayed(idx) {
    if (this.currentPlayingIdx !== idx) {
      this.play(idx);
    }
    this.lastVideoPlayed = idx;
  }
  videoErrorReported() {
    this.stop();
  }

  initializePlayState() {
    this.autoPlayNextItemByRating({ top: this.top, left: this.left });
  }

  //-------------------------------controls------------------------------------//

  autoPlayNextItemByRating({ top, left }) {
    if (!this.shouldAutoPlay()) {
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
      if (!this.idxAutoPlay(item.idx)) {
        return false;
      }
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
      if (!this.allowedLoop() && bestRating.idx === this.lastVideoPlayed) {
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
  }

  calculateCurrentItemPlacement() {
    const idx = this.findItemIndex(this.currentPlayingIdx);
    if (idx >= 0) {
      return this.items[idx];
    }
  }

  play(idx) {
    this.setPlayingIdx(idx);
    this.playing = true;
  }

  stop(idx) {
    const item = this.findItemIndex(idx);
    if (idx >= 0) {
      const newRating = this.itemRatingMap.get(item.id) + this.currentItemCount;
      this.itemRatingMap.set(item.id, newRating);
    }
    this.setPlayingIdx(-1);
    this.playing = false;
  }

  onPlayingIdxChange() {
    this.setPlayingItem(this.currentPlayingIdx);
  }
  //-------------------------------get/set----------------------------------------//

  setPlayingIdx(idx) {
    if (this.currentPlayingIdx !== idx) {
      this.currentPlayingIdx = idx;
      this.onPlayingIdxChange();
    }
  }

  //-----------------------------Utils--------------------------------------------//

  isCurrentItemStillVisible({ top, left }) {
    const currentItemPlacement = this.calculateCurrentItemPlacement();
    return this.isVisible(currentItemPlacement, { top, left });
  }

  isVisible(item, { top, left }) {
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
      this[optionsMap.layoutParams.structure.scrollDirection] ===
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
  }

  shouldAutoPlay() {
    return (
      this.videoPlayTrigger ===
        GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger]
          .AUTO ||
      this.threeDPlayTrigger ===
        GALLERY_CONSTS[
          optionsMap.behaviourParams.item.threeDimensionalScene.playTrigger
        ].AUTO
    );
  }
  allowedLoop() {
    return this.videoLoop === true;
  }
}

export default VideoScrollHelper;

// this.renderedPaddingMultiply = 2;
// this.visiblePaddingMultiply = 0;
// this.videoPlayVerticalTolerance =
//   (this.props.offset.bottom - this.props.offset.top) / 2;
// this.videoPlayHorizontalTolerance =
//   (this.props.offset.right - this.props.offset.left) / 2;
// this.padding = {
//   renderedVertical:
//     utils.parseGetParam('renderedPadding') ||
//     this.screenSize.height * this.renderedPaddingMultiply,
//   visibleVertical:
//     utils.parseGetParam('displayPadding') ||
//     this.screenSize.height * this.visiblePaddingMultiply,
//   playVertical:
//     utils.parseGetParam('playPadding') ||
//     this.screenSize.height * this.visiblePaddingMultiply -
//       this.videoPlayVerticalTolerance,
//   renderedHorizontal:
//     utils.parseGetParam('renderedPadding') ||
//     this.screenSize.width * this.renderedPaddingMultiply,
//   visibleHorizontal:
//     utils.parseGetParam('displayPadding') ||
//     this.screenSize.width * this.visiblePaddingMultiply,
//   playHorizontal:
//     utils.parseGetParam('playPadding') ||
//     this.screenSize.width * this.visiblePaddingMultiply -
//       this.videoPlayHorizontalTolerance,
// };
