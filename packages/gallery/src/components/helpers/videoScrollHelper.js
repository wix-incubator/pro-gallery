import { GALLERY_CONSTS, window } from 'pro-gallery-lib';
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
    this.videoItems = [];
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
    this.isCurrentVideoStillVisible =
      this.isCurrentVideoStillVisible.bind(this);
    this.videoPlay = undefined;
    this.itemClick = undefined;
    this.setPlayingVideos = config.setPlayingVideos;
    this.lastVideoPlayed = -1;
    this.videoRatingMap = new Map();
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
    videoPlay,
    videoLoop,
    itemClick,
    scrollDirection,
  }) {
    this.galleryWidth = galleryWidth;
    this.scrollBase = scrollBase;
    this.videoPlay = videoPlay;
    this.videoLoop = videoLoop;
    this.itemClick = itemClick;
    this.scrollDirection = scrollDirection;
    this.currentItemCount = galleryStructure.galleryItems.length;
    this.videoItems = [];
    galleryStructure.galleryItems.forEach((item) => {
      if (
        item.type === 'video' ||
        (item.type === 'image' &&
          (item.id.includes('_placeholder') || item.isVideoPlaceholder))
      ) {
        // either video or a placeholder for video files (both need to be included in the list)
        if (!this.videoRatingMap.has(item.id)) {
          this.videoRatingMap.set(item.id, item.idx);
        }
        this.videoItems.push(item);
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
      case GALLERY_CONSTS.events.HOVER_UNSET:
        this.itemHoveredUnset(eventData);
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

  itemHovered(idx) {
    if (this.videoPlay !== 'hover') return;
    if (this.IdxExistsInVideoItems(idx)) {
      this.play(idx);
    } else {
      //do nothing
    }
  }

  itemHoveredUnset(idx) {
    if (this.videoPlay !== 'hover') return;
    if (this.IdxExistsInVideoItems(idx)) {
      if (this.currentPlayingIdx === idx) {
        this.stop(idx);
      }
    }
  }

  itemClicked(idx) {
    if (this.videoPlay !== 'onClick') return;
    // if (this.itemClick !== 'nothing') return;
    if (this.IdxExistsInVideoItems(idx)) {
      if (this.currentPlayingIdx === idx) {
        this.stop();
      } else {
        this.play(idx);
      }
    } else {
      //do nothing
    }
  }

  onScroll({ top, left }) {
    this.top = top >= 0 ? top : this.top;
    this.left = left >= 0 ? left : this.left;
    if (this.currentPlayingIdx === -1) {
      this.autoPlayNextVideoByRating({ top: this.top, left: this.left });
    } else {
      if (
        !this.isCurrentVideoStillVisible({ top: this.top, left: this.left })
      ) {
        this.stop(
          this.videoItems.findIndex(
            (item) => item.idx === this.currentPlayingIdx
          )
        );
      }
      this.autoPlayNextVideoByRating({ top: this.top, left: this.left });
    }
  }

  videoEnded(idx) {
    const indexInVideoItems = this.videoItems.findIndex(
      (item) => item.idx === idx
    );
    this.stop(indexInVideoItems);
    const scroll = { top: this.top, left: this.left };
    this.autoPlayNextVideoByRating(scroll);
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
    this.autoPlayNextVideoByRating({ top: this.top, left: this.left });
  }

  //-------------------------------controls------------------------------------//

  autoPlayNextVideoByRating({ top, left }) {
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
    this.videoItems.some((item) => {
      if (this.isVisible(item, { top, left })) {
        const itemRating = this.videoRatingMap.get(item.id);
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
    return this.videoItems.findIndex(
      (item) => item.idx === this.currentPlayingIdx
    );
  }

  play(idx) {
    this.setPlayingIdx(idx);
    this.playing = true;
  }

  stop(indexInVideoItems) {
    if (indexInVideoItems >= 0) {
      const currentVideoId = this.videoItems.find(
        (item) => item.idx === indexInVideoItems
      )?.id;
      const newRating =
        this.videoRatingMap.get(currentVideoId) + this.currentItemCount;
      this.videoRatingMap.set(currentVideoId, newRating);
    }
    this.setPlayingIdx(-1);
    this.playing = false;
  }

  onPlayingIdxChange() {
    this.setPlayingVideos(this.currentPlayingIdx);
  }
  //-------------------------------get/set----------------------------------------//

  setPlayingIdx(idx) {
    if (this.currentPlayingIdx !== idx) {
      this.currentPlayingIdx = idx;
      this.onPlayingIdxChange();
    }
  }

  //-----------------------------Utils--------------------------------------------//

  isCurrentVideoStillVisible({ top, left }) {
    const currentItemPlacement = this.calculateCurrentItemPlacement();
    const item = this.videoItems[currentItemPlacement];
    return item ? this.isVisible(item, { top, left }) : false;
  }

  isVisible(item, { top, left }) {
    const target = {
      offsetTop: this.scrollBase || 0,
      scrollY: top,
      scrollLeft: left,
    };
    const videoPlayVerticalTolerance =
      (item.offset.top - item.offset.bottom) / 2;
    const videoPlayHorizontalTolerance =
      (item.offset.left - item.offset.right) / 2;
    const visibleVertically = isWithinPaddingVertically({
      target,
      scrollBase: this.scrollBase,
      top: item.offset.top,
      bottom: item.offset.top + item.style.height,
      screenHeight: window && window.innerHeight,
      padding: videoPlayVerticalTolerance,
    });
    let visibleHorizontally;
    if (this.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL) {
      visibleHorizontally = true;
    } else {
      visibleHorizontally = isWithinPaddingHorizontally({
        target,
        left: item.offset.left,
        right: item.offset.left + item.style.width,
        screenWidth: this.galleryWidth || (window && window.innerWidth),
        padding: videoPlayHorizontalTolerance,
      });
    }
    return visibleVertically && visibleHorizontally;
  }

  shouldAutoPlay() {
    return this.videoPlay === 'auto';
  }
  allowedLoop() {
    return this.videoLoop === true;
  }

  IdxExistsInVideoItems(idx) {
    return this.videoItems.some((item) => item.idx === idx);
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
