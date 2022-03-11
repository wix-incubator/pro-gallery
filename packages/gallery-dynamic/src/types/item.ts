import { IItem, IItemStyling } from './gallery';

export interface ItemProps {
  item: IItem;
  styling: IItemStyling;
  location: {
    top: number;
    left: number;
  };
  galleryStructure: any;
  container: HTMLDivElement;
}
