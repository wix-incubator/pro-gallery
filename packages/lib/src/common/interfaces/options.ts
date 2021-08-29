import { LayoutParams } from './layoutParams';
import { BehaviourParams } from './behaviourParams';
import { StylingParams } from './stylingParams';

export interface Options {
  layoutParams?: LayoutParams;
  behavourParams?: BehaviourParams;
  stylingParams?: StylingParams;
  [key: string]: any;
}
