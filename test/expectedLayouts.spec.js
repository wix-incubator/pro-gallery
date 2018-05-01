'use strict';
/* eslint-disable */

import Layouter from '../src/layouter.js';
import {testImages} from './images-mock.js';
import deepFreeze from 'deep-freeze';
import {expect} from 'chai';
import expectedOffsets from './expectedOffsets';

const getItems = count => deepFreeze(testImages.slice(0, count));

const log = require('log-to-file');

describe('Expected Layouts', () => {

  let gallery;
  let layouter;
  let container = {};
  const styleParams = {};
  let styleParamsOptions = {};

  const getLayout = layoutParams => layouter.createLayout(layoutParams);

  beforeEach(() => {

    const items = getItems();

    styleParamsOptions = {
      oneRow: [true, false],
      isVertical: [true, false],
      gallerySize: [100, 500],
      groupSize: [1, 3],
      groupTypes: ['1,2h,2v,3t,3b,3l,3r,3v,3h', '2h,2v,3t,3v,3h'],
      cubeImages: [true, false],
      cubeRatio: [1, 2],
      smartCrop: [true, false],
      chooseBestGroup: [true, false],
      collageDensity: [0, 1],
      minItemSize: [20, 200],
      imageMargin: [0, 100],
      fixedColumns: [0, 5]
    };

    container = {
      galleryWidth: 1000,
      bounds: {
        visibleTop: 0,
        visibleBottom: 1000,
        renderedTop: 0,
        renderedBottom: 10000
      }
    };

    layouter = new Layouter({items, container, styleParams});
  });

  it('should remain as expected', () => {

    if (process.env.IN_WALLABY) {
      return; //do not run this test in wallaby (takes too long)
    }


    const isDebug = false;

    const items = getItems(20);

    const totalOptions = [];
    for (const option of Object.values(styleParamsOptions)) {
      totalOptions.push((totalOptions[totalOptions.length - 1] || 1) * option.length);
    }

    const selectStyleParams = seed => {
      const styleParams = {};
      const styleParamsArr = Object.entries(styleParamsOptions);
        // console.log(styleParamsArr);
      let idx = 0;
      for (const [key, value] of styleParamsArr) {
        styleParams[key] = value[Math.floor(seed / totalOptions[idx]) % value.length];
        idx++;
      }
      return styleParams;
    };

    const startTime = Date.now();
    for (let seed = 1; seed < totalOptions[totalOptions.length - 1]; seed++) {
      const styleParams = (selectStyleParams(seed));

      gallery = getLayout({items, container, styleParams});

      const offsets = gallery.items.reduce((str, item) => {
        const os = item.offset;
        const itemStr = (`{t:${Math.round(os.top)},l:${Math.round(os.left)},r:${Math.round(os.right)},b:${Math.round(os.bottom)}}`);
        return str + itemStr;
      }, '');

      if (isDebug) {
        if (!(seed % 100)) {
          console.log(`Completed ${Math.round(100 * seed / totalOptions[totalOptions.length - 1])}% ${seed}/${totalOptions[totalOptions.length - 1]} layouts (${Math.floor((Date.now() - startTime) / 1000)}s)`);
        }
        log('\'' + offsets + '\',');
      } else {
        expect(offsets).to.equal(expectedOffsets[seed - 1]);
      }
    }

  });
});
