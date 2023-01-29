import { Options, PlayTrigger } from 'pro-gallery-lib';

export type SetItemIdx = (idx: number) => void;
export type SetScroll = (scroll: Scroll) => void;
export type Scroll = { top: number; left: number };
export type ScrollHelperGalleryData = {
  options: Options;
  galleryStructure: any;
  galleryWidth: number;
  scrollBase: number;
  setPlayingIdxState: SetItemIdx;
  isSSR: boolean;
};
export type UpdateGalleryData = (data: ScrollHelperGalleryData) => void;
export type GetPlayTrigger = (options: Options) => PlayTrigger;
export type HandleEvents = (event: {
  eventName: string;
  eventData: any;
}) => void;

export type MediaScrollHelperHandlerConfiguration = {
  supportedItemsFilter: (item: any) => boolean;
  getPlayTrigger: GetPlayTrigger;
  onSetPlayingIdx: SetItemIdx;
}[];
