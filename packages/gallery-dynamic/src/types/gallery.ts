import { IAnimation, IAnimationSpring } from './animations';
import { IItemCss } from './css';

export interface IItemElement {
  intialStyle: IItemCss;
  inViewStyle: IItemCss;
  animations: IAnimation[];
  spring: Partial<IAnimationSpring>;
  engine: AnimationEngine;
  transitionDuration: number;
}

export interface IItemStyling {
  elements: {
    content: IItemElement;
    container: IItemElement;
  };
  animationMergeStrategy: AnimationMergeStrategy;
}

export type AnimationMergeStrategy = 'merge' | 'replace';

export type AnimationEngine = 'transition' | 'framer-motion';

export interface IItem {
  //styling?: IItemStyling;
  id: string;
  order: number;
  metaData: {
    width: number;
    height: number;
  };
}

export interface IGalleryStructureParams {
  container: {
    width: number;
    height: number;
  };
  styleParams: any;
  items: {
    id: string;
    width: number;
    height: number;
    maxWidth: number;
    maxHeight: number;
  }[];
}

export interface IGallery {
  items: IItem[];
  layoutParams: IGalleryStructureParams;
  baseItemStyling: IItemStyling;
  settings: IGallerySettings;
}

export interface IGallerySettings {
  layoutParams: IGalleryLayoutParams;
  animationParams: IGalleryAnimationParams;
}

export interface IGalleryLayoutParams {
  viewportThreshold: number;
  imageLoadThreshold: number;
  imageForceLoadThreshold: number;
}

export interface IGalleryAnimationParams {
  loadAnimationDistanceFromViewport: number;
}
