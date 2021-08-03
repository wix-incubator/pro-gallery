export type PlayOn = 'hover' | 'auto' | 'onClick';
export interface Video {
  playOn: PlayOn;
}

export interface Item {
  video: Video;
}

export interface StyleParams {
  layoutParams: LayoutParams;
  // item: Item;
}
export interface LayoutParams {
  numberOfGroupsPerRow: number;
}
