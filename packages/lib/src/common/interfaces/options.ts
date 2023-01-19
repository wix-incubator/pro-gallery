import { LayoutParams } from './layoutParams';
import { BehaviourParams } from './behaviourParams';
import { StylingParams } from './stylingParams';

export interface Options {
  layoutParams?: LayoutParams;
  behaviourParams?: BehaviourParams;
  stylingParams?: StylingParams;
}
