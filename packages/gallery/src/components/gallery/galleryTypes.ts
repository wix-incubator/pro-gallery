import { PhotoItem, VideoItem, TextItem } from '../../common/interfaces/Item';

type ViewMode = 'SITE' | 'EDIT' | 'PREVIEW' | 'SEO';
type FormFactor = 'desktop' | 'mobile' | 'tablet';

export interface GalleryProps {
  id?: string;
  totalItemsCount?: number;
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
