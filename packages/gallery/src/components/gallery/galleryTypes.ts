import { PhotoItem, VideoItem, TextItem } from '../../common/interfaces/Item';
import { Container } from '../../common/interfaces/Container';
import { EventsListener } from '../../common/interfaces/EventsListener';

type ViewMode = 'SITE' | 'EDIT' | 'PREVIEW' | 'SEO';
type DeviceType = 'desktop' | 'mobile' | 'tablet';
type ResizeMethods = 'fill' | 'fit' | 'full' | 'video';

interface CreateMediaUrl {
  (args: {
    item: unknown;
    originalUrl: string;
    resizeMethod: ResizeMethods; // RESIZE_METHODS
    requiredWidth: number;
    requiredHeight: number;
    sharpParams?: Record<string, any>;
    focalPoint?: [number, number];
    createMultiple?: boolean; //new
    imageToken?: string; // new
    watermark?: string; //old
  }): string;
}

export interface GalleryProps {
  container: Container;
  items: (PhotoItem | VideoItem | TextItem)[];
  id?: string;
  totalItemsCount?: number;
  activeIndex?: number;
  isPrerenderMode?: boolean;
  viewMode?: ViewMode;
  deviceType?: DeviceType;
  eventsListener?: EventsListener;
  createMediaUrl?: CreateMediaUrl;
  [key: string]: any;
}

export interface GalleryState {
  blueprint: any;
  typeErrors?: any;
}
