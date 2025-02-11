import Layouter from './layouter.js';

export default function createLayout(...args) {
  return new Layouter(...args).createLayout();
}
