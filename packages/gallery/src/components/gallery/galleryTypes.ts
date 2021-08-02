import { PhotoItem, VideoItem, TextItem } from '../../common/interfaces/Item';
import { Container } from '../../common/interfaces/Container';
import { EventsListener } from '../../common/interfaces/EventsListener';
import { CreateMediaUrl } from '../../common/interfaces/CreateMediaUrl';

type ViewMode = 'SITE' | 'EDIT' | 'PREVIEW' | 'SEO';
type DeviceType = 'desktop' | 'mobile' | 'tablet';

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
