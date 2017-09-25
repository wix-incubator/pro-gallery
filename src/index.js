import Layouter from './layouter';
import {testImages} from './images-mock.js';

const items = testImages;

const styleParams = {
  isVertical: false,
  gallerySize: 200,
  groupSize: 3,
  groupTypes: '1,2h,2v,3t,3b,3l,3r,3v,3h',
  cubeImages: false,
  collageAmount: 0.3,
  collageDensity: 0.3,
  minItemSize: 20,
  layoutsVersion: 2,
  galleryMargin: 0,
  imageMargin: 0
};

const container = {
  galleryWidth: 1000,
  bounds: {
    visibleTop: 0,
    visibleBottom: 1000,
    renderedTop: 0,
    renderedBottom: 10000
  }
};

const layout = new Layouter({items, container, styleParams});

console.log(layout);