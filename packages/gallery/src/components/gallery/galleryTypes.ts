import { Dimensions } from '../../common/interfaces/Dimensions';

export interface GalleryProps {
  domId?: string;
  dimensions: Dimensions;
  [key: string]: any;
}

export interface GalleryState {
  blueprint: any;
  typeErrors?: any;
}
