import { window } from 'pro-gallery-lib';

export function isGalleryInViewport(containerRef) {
  try {
    const rect = containerRef.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom >= 0;
  } catch (e) {
    console.warn('Could not calculate viewport', e);
    return true;
  }
}
