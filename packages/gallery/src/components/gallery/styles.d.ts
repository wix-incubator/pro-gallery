import { LayoutParams } from './styles.d';
export type PlayOn = 'hover' | 'auto' | 'onClick';
export interface Video {
  playOn: PlayOn;
  [key: string]: any;
}

export interface Item {
  video: Video;
  [key: string]: any;
}

export interface StyleParams {
  // item: Item;
  LayoutParams: LayoutParams;
}
export interface LayoutParams {
  numberOfGroupsPerRow: number;
  gallerySpacing: number;
}
