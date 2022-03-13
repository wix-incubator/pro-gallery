import { IGallerySettings, IItem, IItemStyling } from './gallery';

export interface ItemProps {
  item: IItem;
  styling: IItemStyling;
  location: ItemLocation;
  galleryStructure: any;
  container: HTMLDivElement;
  settings: IGallerySettings;
}

export interface ItemLocation {
  top: number;
  left: number;
  width: number;
  height: number;
}

export type RelationToViewport = 'above' | 'inside' | 'below';
