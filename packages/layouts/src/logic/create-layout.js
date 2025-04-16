import Layouter from './layouter';

export default function createLayout(...args) {
  return new Layouter(...args).createLayout();
}
