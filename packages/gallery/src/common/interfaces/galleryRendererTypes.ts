import { GalleryProps } from './galleryTypes';
import { RendererContainer } from './RendererContainer';

export interface Structure {
  items: any;
  groups: any;
  strips: any;
  columns: any;
  height: number;
  width: number;
}

export interface GalleryRendererProps extends GalleryProps {
  container: RendererContainer;
  structure: Structure;
}
