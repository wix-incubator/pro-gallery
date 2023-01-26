export const URL_SIZES = {
  RESIZED: 'resized',
  MULTI: 'multi',
  SCALED: 'scaled',
  PIXEL: 'pixel',
  THUMBNAIL: 'thumbnail',
  SQUARE: 'square',
  FULL: 'full',
  SAMPLE: 'sample',
  PRELOAD: 'preload',
  DOWNLOAD: 'download',
  DOWNLOAD_SAMPLE: 'download_sample',
  MAGNIFIED: 'magnified',
} as const;

export const URL_TYPES = {
  HIGH_RES: 'img',
  LOW_RES: 'thumb',
  VIDEO: 'video',
  THREE_D: '3d',
} as const;
