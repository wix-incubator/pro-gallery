import { window } from 'pro-gallery-lib';

// Promise-wrapping class
export class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = (...args) => {
        this.isPending = false;
        reject(...args);
      };
      this.resolve = (...args) => {
        this.isPending = false;
        resolve(...args);
      };
      this.isPending = true;
    });
  }
}

export function isGalleryInViewport({ container, scrollTop }) {
  try {
    const isTopVisible = container.scrollBase < scrollTop + window.innerHeight;
    const isBottomVisible = container.scrollBase + container.galleryHeight > scrollTop;
    return isTopVisible && isBottomVisible;
  } catch (e) {
    console.warn('Could not calculate viewport', e);
    return true;
  }
}
