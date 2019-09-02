import {
  isWithinPaddingVertically,
  isWithinPaddingHorizontally,
} from './scrollHelper';
import EVENTS from '../../utils/constants/events';
import window from '../../utils/window/windowWrapper';

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
    this.nextInLineIdx = -1;
    this.lastItemCount = 0;
    this.playing = false;
    this.updateGalleryStructure = this.updateGalleryStructure.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
    this.getPlayingIdx = this.getPlayingIdx.bind(this);
    this.top = 0;
    this.left = 0;
    this.videoPlay = undefined;
    this.setPlayingVideos = config.setPlayingVideos;

    this.trigger = Object.assign(
      {},
      ...Object.keys(VIDEO_EVENTS).map(key => ({
        [key]: args => this.handleEvent({ eventName: key, eventData: args }),
      })),
    );
  }

  //--------------------------updates----------------------------------//
  updateGalleryStructure({ galleryStructure, scrollBase, videoPlay, oneRow }) {
    this.scrollBase = scrollBase;
    this.videoPlay = videoPlay;
    this.oneRow = oneRow;
    const lastItemCount = this.lastItemCount;
    const newItemCount = galleryStructure.galleryItems.length;
    this.lastItemCount = newItemCount;
    if (lastItemCount === newItemCount) {
      return;
    } else {
      const newItems = galleryStructure.galleryItems.slice(
        lastItemCount, //make sure this is the right way
        newItemCount,
      );
      newItems.forEach(item => {
        if (item.type === 'video') {
          this.videoItems.push({ ...item, videoPlayRating: item.idx });
        }
      });
    }
  }

  //--------------------------triggers--------------------------------//

  handleEvent({ eventName, eventData }) {
    switch (eventName) {
      case VIDEO_EVENTS.SCROLL:
        this.onScroll(eventData);
        break;
      case EVENTS.ITEM_ACTION_TRIGGERED:
        //case VIDEO_EVENTS.clicked:
        this.itemClicked(eventData.idx);
        break;
      case EVENTS.HOVER_SET:
        //case VIDEO_EVENTS.hovered:
        this.itemHovered(eventData);
        break;
      case EVENTS.VIDEO_ENDED:
        //case VIDEO_EVENTS.ended:
        this.videoEnded(eventData.idx);
        break;
      case VIDEO_EVENTS.INIT_SCROLL:
        this.ScrollializePlayState();
        break;
      default:
    }
  }

  itemHovered(idx) {
    if (this.videoPlay !== 'hover') return;
    if (this.IdxExistsInVideoItems(idx)) {
      this.play(idx, -1);
    } else {
      //do nothing
    }
  }

  itemClicked(idx) {
    if (this.videoPlay !== 'onClick') return;
    if (this.IdxExistsInVideoItems(idx)) {
      if (this.currentPlayingIdx === idx) {
        this.stop();
      } else {
        this.play(idx, -1);
      }
    } else {
      //do nothing
    }
  }

  onScroll({ top, left }) {
    this.top = top ? top : this.top;
    this.left = left ? left : this.left;
    if (this.currentPlayingIdx === -1) {
      this.shouldAutoPlay() &&
        this.playNextVideoByRating({ top: this.top, left: this.left });
    } else {
      if (
        !this.isCurrentVideoStillVisible({ top: this.top, left: this.left })
      ) {
        this.stop(
          this.videoItems.findIndex(
            item => item.idx === this.currentPlayingIdx,
          ),
        );
      }
      this.shouldAutoPlay() &&
        this.playNextVideoByRating({ top: this.top, left: this.left });
    }
  }

  videoEnded(idx) {
    const indexInVideoItems = this.videoItems.findIndex(
      item => item.idx === idx,
    );
    this.stop(indexInVideoItems);
    const scroll = { top: this.top, left: this.left };
    this.shouldAutoPlay() && this.playNextVideoByRating(scroll);
  }

  initializePlayState() {
    if (this.shouldAutoPlay()) {
      this.playNextVideoByRating({ top: this.top, left: this.left });
    }
  }

  //-------------------------------controls------------------------------------//

  playNextVideoByRating({ top, left }) {
    const secondBestRating = {
      idx: -1,
      rating: Infinity,
    };
    const bestRating = {
      idx: -1,
      rating: Infinity,
    };
    this.videoItems.some(item => {
      if (this.isVisible(item, { top, left })) {
        if (item.videoPlayRating <= bestRating.rating) {
          secondBestRating.idx = bestRating.idx;
          secondBestRating.rating = bestRating.rating;
          bestRating.idx = item.idx;
          bestRating.rating = item.videoPlayRating;
        } else if (item.videoPlayRating <= secondBestRating.rating) {
          secondBestRating.idx = item.idx;
          secondBestRating.rating = item.videoPlayRating;
        }
        return false;
      } else {
        if (bestRating.idx >= 0) {
          return true;
        }
        return false;
      }
    });
    this.play(bestRating.idx, secondBestRating.idx);
  }

  calculateCurrentItemPlacement() {
    return this.videoItems.findIndex(
      item => item.idx === this.currentPlayingIdx,
    );
  }

  play(idx, nextIdx) {
    this.setNextInLineIdx(nextIdx);
    this.setPlayingIdx(idx);
    this.playing = true;
  }

  stop(indexInVideoItems) {
    if (indexInVideoItems >= 0) {
      this.videoItems[indexInVideoItems].videoPlayRating += 1337;
    }
    this.setPlayingIdx(-1);
    this.playing = false;
  }

  onPlayingIdxChange() {
    this.setPlayingVideos(this.currentPlayingIdx, this.nextInLineIdx);
  }
  //-------------------------------get/set----------------------------------------//

  getPlayingIdx() {
    return this.currentPlayingIdx;
  }

  setPlayingIdx(idx) {
    if (this.currentPlayingIdx !== idx) {
      this.currentPlayingIdx = idx;
      this.onPlayingIdxChange();
    }
  }

  setNextInLineIdx(idx) {
    if (this.nextInLineIdx !== idx) {
      this.nextInLineIdx = idx;
      this.onPlayingIdxChange();
    }
  }
  //-----------------------------Utils--------------------------------------------//

  isCurrentVideoStillVisible({ top, left }) {
    const currentItemPlacement = this.calculateCurrentItemPlacement();
    return this.isVisible(this.videoItems[currentItemPlacement], { top, left });
  }

  isVisible(item, { top, left }) {
    const target = {
      offsetTop: this.scrollbase || 0,
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
      screenHeight: window && window.screen && window.screen.height,
      padding: videoPlayVerticalTolerance,
    });
    let visibleHorizontally;
    if (!this.oneRow) {
      visibleHorizontally = true;
    } else {
      visibleHorizontally = isWithinPaddingHorizontally({
        target,
        left: item.offset.left,
        right: item.offset.left + item.style.width,
        screenWidth: window && window.screen && window.screen.width,
        padding: videoPlayHorizontalTolerance,
      });
    }
    return visibleVertically && visibleHorizontally;
  }

  shouldAutoPlay() {
    return this.videoPlay === 'auto';
  }

  IdxExistsInVideoItems(idx) {
    return this.videoItems.some(item => item.idx === idx);
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
