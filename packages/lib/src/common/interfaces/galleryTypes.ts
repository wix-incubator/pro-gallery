import { Item } from './Item.js';
import { Container } from './Container.js';
import { EventsListener } from './EventsListener.js';
import { CreateMediaUrl } from './CreateMediaUrl.js';
import { CustomComponents } from './CustomComponents.js';
import { ScrollingElement } from './ScrollingElement.js';
import { Settings } from './Settings.js';
import { Options } from './options.js';
import { VirtualizationSettings } from './virtualization.js';

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
}

export interface GalleryState {
  blueprint: any;
  typeErrors?: any;
}
