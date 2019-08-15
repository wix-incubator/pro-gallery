import { expect } from 'chai';
import createLayout from '../src/create-layout';
import Layouter from '../src/layouter';

const getLayoutParams = () => ({
  styleParams: { oneRow: true },
  container: { width: 100 },
  items: [{ id: '0', width: 50, height: 100 }],
});

describe('createLayout', () => {
  it('should create layout', () => {
    const actual = createLayout(getLayoutParams());
    const expected = new Layouter(getLayoutParams()).createLayout();

    expect(actual).to.deep.equal(expected);
  });
});
