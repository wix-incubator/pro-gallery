import { PhotoItem, VideoItem, TextItem } from '../../common/interfaces/Item';
import { Dimensions } from '../../common/interfaces/Dimensions';

type ViewMode = 'SITE' | 'EDIT' | 'PREVIEW' | 'SEO';
type FormFactor = 'desktop' | 'mobile' | 'tablet';

export interface GalleryProps {
  domId?: string;
  dimensions: Dimensions;
  totalItemsCount: number;
  items: (PhotoItem | VideoItem | TextItem)[];
  currentIdx?: number;
  isPrerenderMode?: boolean;
  viewMode?: ViewMode;
  formFactor?: FormFactor;
  [key: string]: any;
}

export interface GalleryState {
  blueprint: any;
  typeErrors?: any;
}
