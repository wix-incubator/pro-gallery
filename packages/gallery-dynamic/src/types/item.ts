import { IItem, IItemStyling } from './gallery';

export interface ItemProps {
  item: IItem;
  styling: IItemStyling;
  location: ItemLocation;
  galleryStructure: any;
  container: HTMLDivElement;
}

export interface ItemLocation {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}
