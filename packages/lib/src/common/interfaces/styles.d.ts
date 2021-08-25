import { LayoutParams } from './layoutParams';
import { BehaviourParams } from './behaviourParams';
import { StylingParams } from './stylingParams';

export interface StyleParams {
  layoutParams: LayoutParams;
  behavourParams?: BehaviourParams;
  stylingParams?: StylingParams;
  [key: string]: any;
}
