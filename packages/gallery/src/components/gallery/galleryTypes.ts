import { PhotoItem, VideoItem, TextItem } from '../../common/interfaces/Item';
import { Container } from '../../common/interfaces/Container';

type ViewMode = 'SITE' | 'EDIT' | 'PREVIEW' | 'SEO';
type FormFactor = 'desktop' | 'mobile' | 'tablet';

export interface GalleryProps {
  container: Container;
  domId?: string;
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
