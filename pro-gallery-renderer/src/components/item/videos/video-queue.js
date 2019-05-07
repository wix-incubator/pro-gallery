export class VideoQueue {
  constructor() {
    this.que = [];
    this.dummyVideo = { idx: -1, isVisible: () => false };
    this.video = this.dummyVideo;
  }
  current() {
    return this.video.idx;
  }

  isCurrentVideoVisible() {
    return this.video.isVisible();
  }

  next() {
    if (this.que.length === 0) {
      return null;
    }
    const i = this.que.indexOf(this.video);
    const nextVideo = this.nextVisibleVideo(i + 1);

    this.video = nextVideo;
    return this.video.idx;
  }

  nextVisibleVideo(j) {
    const len = this.que.length;
    let queIndex;
    for (let i = 0; i < len; i++) {
      queIndex = (i + j) % len;
      if (this.que[queIndex].isVisible()) {
        break;
      }
    }
    return this.que[queIndex] && this.que[queIndex].isVisible()
      ? this.que[queIndex]
      : this.dummyVideo;
  }

  isEmpty() {
    return this.que.length === 0;
  }

  addItem(item) {
    if (this.isEmpty()) {
      this.video = item;
    }
    this.que.push(item);
  }

  removeItem(id) {
    this.que = this.que.filter(element => element.idx !== id);
    if (this.isEmpty()) {
      this.video = this.dummyVideo;
    }
    this.video = this.nextVisibleVideo(0);
  }
}
