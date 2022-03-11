import { IItemCss } from './css';

export type AnimationTrigerEvents = 'enter' | 'leave' | 'resoultionChange';

export interface IAnimation {
  on: AnimationTrigerEvents;
  data: IAnimationData;
}

export interface IAnimationData {
  element: string;
  frames: IAnimationFrame[];
  keep: boolean;
}

export interface IAnimationSpring {
  mass: number;
  stiffness: number;
  damping: number;
  bounce: number;
  velocity: number;
  clamp: boolean;
}

export interface INamedAnimationData extends IAnimationData {
  name: string;
  id: string;
}

export interface IAnimationFrame {
  duration: number;
  css: IItemCss;
}
