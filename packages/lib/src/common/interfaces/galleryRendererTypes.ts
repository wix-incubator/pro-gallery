import { GalleryProps } from './galleryTypes';
import { RendererContainer } from './RendererContainer';
import { Structure } from './Structure';

export interface GalleryRendererProps extends GalleryProps {
  container: RendererContainer;
  structure: Structure;
}
