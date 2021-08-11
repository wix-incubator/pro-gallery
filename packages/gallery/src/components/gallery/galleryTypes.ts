import { Item } from '../../common/interfaces/Item';
import { Container } from '../../common/interfaces/Container';
import { EventsListener } from '../../common/interfaces/EventsListener';
import { CreateMediaUrl } from '../../common/interfaces/CreateMediaUrl';
import { CustomComponents } from '../../common/interfaces/CustomComponents';
import { ScrollingElement } from '../../common/interfaces/ScrollingElement';
import { StyleParams } from './styles';

type ViewMode = 'SITE' | 'EDIT' | 'PREVIEW' | 'SEO';
type DeviceType = 'desktop' | 'mobile' | 'tablet';

export interface Settings {
  disableSSROpacity?: boolean;
  avoidInlineStyles?: boolean;
  imageProps?: (id: string) => { [key: string]: any };
}

export interface GalleryProps {
  container: Container;
  items: Item[];
  styles?: StyleParams;
  options?: StyleParams;
  styleParams?: StyleParams;
  id?: string;
  totalItemsCount?: number;
  activeIndex?: number;
  isPrerenderMode?: boolean;
  viewMode?: ViewMode;
  deviceType?: DeviceType;
  eventsListener?: EventsListener;
  createMediaUrl?: CreateMediaUrl;
  settings?: Settings;
  proGalleryRegionLabel?: string;
  proGalleryRole?: string;
  translations?: Record<string, string>;
  customComponents?: CustomComponents;
  scrollingElement?: ScrollingElement;
  isInDisplay?: boolean;
  enableExperimentalFeatures?: boolean;
  [key: string]: any;
}

export interface GalleryState {
  blueprint: any;
  typeErrors?: any;
}
