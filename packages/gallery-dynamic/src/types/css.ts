import { TransformProperties } from 'framer-motion/types/motion/types';

export interface IItemCss {
  opacity?: number;
  transform?: Partial<Record<keyof TransformProperties, number>>;
  border?: {
    width?: number;
    color?: IColor;
  };
  backgroundColor?: IColor;
  boxShadow?: {
    color?: IColor;
    offsetX?: number;
    offsetY?: number;
    blur?: number;
    spread?: number;
  };
  borderRadius?: {
    topLeft?: number;
    topRight?: number;
    bottomLeft?: number;
    bottomRight?: number;
  };
  filter?: {
    blur?: number;
    brightness?: number;
    contrast?: number;
    grayscale?: number;
    hueRotate?: number;
    invert?: number;
    opacity?: number;
    saturate?: number;
    sepia?: number;
  };
  zIndex?: number;
}

export interface IColor {
  r: number;
  g: number;
  b: number;
  a: number;
}
