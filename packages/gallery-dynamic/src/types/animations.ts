import { IItemCss } from './css';

export type AnimationTrigerEvents = 'enter' | 'leave' | 'resoultionChange';

export interface IAnimation {
  on: AnimationTrigerEvents;
  data: IAnimationData;
}

export interface IAnimationData {
  frames: IAnimationFrame[];
  keep: boolean;
}

export interface IAnimationSpring {
  mass: number;
  stiffness: number;
  duration: number;
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
  after: number;
  css: IItemCss;
}
