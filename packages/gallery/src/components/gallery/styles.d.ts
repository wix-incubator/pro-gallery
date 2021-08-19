import LayoutParams from './layoutParams.d';
import BehaviourParams from './behaviourParams.d';

export interface StyleParams {
  layoutParams: LayoutParams;
  behavourParams?: BehaviourParams;
  stylingParams?: StylingParams;
  [key: string]: any;
}
