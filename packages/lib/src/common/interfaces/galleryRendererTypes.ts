import { GalleryProps } from './galleryTypes.js';
import { RendererContainer } from './RendererContainer.js';
import { Structure } from './Structure.js';

export interface GalleryRendererProps extends GalleryProps {
  container: RendererContainer;
  structure: Structure;
}
