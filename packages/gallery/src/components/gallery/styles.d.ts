import { LayoutParams } from './layoutParams.d';
import { BehaviourParams } from './behaviourParams.d';
import { StylingParams } from './stylingParams.d';

export interface StyleParams {
  layoutParams: LayoutParams;
  behaviourParams?: BehaviourParams;
  stylingParams?: StylingParams;
  [key: string]: any;
}
