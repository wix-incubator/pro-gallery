import { expect } from 'chai';
import createLayout from '../src/logic/create-layout';
import Layouter from '../src/logic/layouter';
import { dec } from '../src/logic/calc';
import { BigNumber } from 'bignumber.js';
import { testImages } from './images-mock.js';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

const getItems = (count) => testImages.slice(0, count);
const styleParams = {
  layoutParams: {
    gallerySpacing: 0,
    cropRatio: 1,
    repeatingGroupTypes: '',
  },
  scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
  isVertical: false,
  targetItemSize: 200,
  groupSize: 3,
  groupTypes: '1,2h,2v,3t,3b,3l,3r,3v,3h',
  cubeImages: false,
  cubeType: 'fill',
  smartCrop: false,
  chooseBestGroup: true,
  collageAmount: 0.9,
  collageDensity: 0.9,
  minItemSize: 20,
  imageMargin: 10,
  scatter: 0,
  rotatingScatter: '',
  fixedColumns: 0,
};

const getLayoutParams = () => ({
  styleParams: styleParams,
  container: { width: 1000 },
  items: getItems(100), //[{ id: '0', width: 50, height: 100 }],
});

describe.only('createLayout', () => {
  it('10000000 normal calculations', () => {
    let total = 0;
    for (let i = 0; i < 10000000; i++) {
      total = total + Math.random();
    }
    expect(total).to.be.above(1);
  });

  it('100000 dec calculations', () => {
    let total = 0;
    for (let i = 0; i < 100000; i++) {
      total = dec`${total} + ${Math.random()}`;
    }
    expect(total).to.be.above(1);
  });

  it('100000 BigNumber calculations', () => {
    let total = 0;
    for (let i = 0; i < 100000; i++) {
      total = BigNumber(total).plus(Math.random());
    }
    expect(parseFloat(total)).to.be.above(1);
  });

  it.only('should create layout FAST', () => {
    let actual;
    let expected;
    const start = Date.now();
    const total = 5;
    for (let i = 0; i < total; i++) {
      actual = createLayout(getLayoutParams());
      expected = new Layouter(getLayoutParams()).createLayout();
      expect(actual).to.deep.equal(expected);
    }
    const end = Date.now();
    expect((end - start) / total).to.be.below(10);
  });
});
