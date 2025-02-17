import { LayoutParams } from './layoutParams.js';
import { BehaviourParams } from './behaviourParams.js';
import { StylingParams } from './stylingParams.js';

export interface Options {
  layoutParams?: LayoutParams;
  behaviourParams?: BehaviourParams;
  stylingParams?: StylingParams;
}
