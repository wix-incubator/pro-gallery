import { Options, Settings, ThreeDimensionalScene } from 'pro-gallery-lib';

export interface ThreeDProps {
  calculatedAlt: string;
  title: string;
  description: string;
  id: string;
  idx: number;
  activeIndex: number;
  options: Options;
  createUrl: any;
  createMagnifiedUrl: any;
  settings: Settings;
  isPrerenderMode: boolean;
  isTransparent: boolean;
  style: any;
  actions: any;
  customComponents: any;
  scene: ThreeDimensionalScene;
  imageDimensions: any;
}
