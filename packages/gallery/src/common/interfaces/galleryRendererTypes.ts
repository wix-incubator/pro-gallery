import { GalleryProps } from './galleryTypes';
import { RendererContainer } from './RendererContainer';

export interface GalleryRendererProps extends GalleryProps {
  container: RendererContainer;
  structure: any;
}
