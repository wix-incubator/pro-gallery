import { Item } from './Item';
import { Container } from './Container';
import { EventsListener } from './EventsListener';
import { CreateMediaUrl } from './CreateMediaUrl';
import { CustomComponents } from './CustomComponents';
import { ScrollingElement } from './ScrollingElement';
import { Settings } from './Settings';
import { Options } from './options';
import { VirtualizationSettings } from './virtualization';

type ViewMode = 'SITE' | 'EDIT' | 'PREVIEW' | 'SEO';
type DeviceType = 'desktop' | 'mobile' | 'tablet';

export interface GalleryProps {
  container: Container;
  items: Item[];
  options: Options;
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
  virtualizationSettings?: VirtualizationSettings;
  shouldIgnoreFocusRing?: boolean;
}

export interface GalleryState {
  blueprint: any;
  typeErrors?: any;
}
