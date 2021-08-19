export type PlayOn = 'hover' | 'auto' | 'onClick';
export interface Video {
  playOn: PlayOn;
  [key: string]: any;
}
export interface BehaviourParams {
  item?: Item;
  // gallery?: Gallery;
  [key: string]: any;
}
export interface Item {
  video: Video;
  [key: string]: any;
}
