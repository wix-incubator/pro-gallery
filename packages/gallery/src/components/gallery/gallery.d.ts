import { Dimensions } from '../../common/interfaces/Dimensions';

export interface GalleryState {
  blueprint: any;
  typeErrors?: any;
}

export type PlayOn = 'hover' | 'auto' | 'onClick';
export interface Video {
  playOn: PlayOn;
}

export interface Item {
  video: Video;
}

export interface StyleParams {
  item: Item;
}
