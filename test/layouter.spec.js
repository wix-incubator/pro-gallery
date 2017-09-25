/// <reference path="../../reference.ts" />

'use strict'

import Layouter from '../src/layouter.js';
import {testImages} from './images-mock.js';
import * as _ from 'lodash';
import {expect} from 'chai';

describe('Pro Gallery Viewer', function () {

  var gallery;
  var items;
  var container = {};
  var styleParams = {};
  
  beforeEach(function () {

    items = _.cloneDeep(testImages);

    styleParams = {
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

    container = {
      galleryWidth: 1000,
      bounds: {
        visibleTop: 0,
        visibleBottom: 1000,
        renderedTop: 0,
        renderedBottom: 10000
      }
    };
  });

  it('must contain all items in the gallery', function () {
    var gallerySizes = [10, 50, 100, 250];

    for (var size, i = 0; size = gallerySizes[i]; i++) {
      items = _.cloneDeep(testImages);
      size = Math.min(items.length, size);
      items = items.slice(0, size);

      gallery = new Layouter({items, container, styleParams});

      var totalItems = gallery.columns[0].reduce((g, group) => {
        return (g + group.items.length);
      }, 0);

      expect(totalItems).to.equal(size);
    }

  });

  it('must be contain each item in the gallery', function () {

    var gallerySizes = [10, 50, 100, 250];

    styleParams.galleryWidth = 500;
    styleParams.minItemSize = 160;

    for (var size, i = 0; size = gallerySizes[i]; i++) {
      items = _.cloneDeep(testImages);
      size = Math.min(items.length, size);
      items = items.slice(0, size);


      var urls = {};
      items.forEach(function (item) {
        urls[item.url] = 1;
      });

      gallery = new Layouter({items, container, styleParams});

      gallery.columns.forEach((column) => {
        column.forEach((group) => {
          group.items.forEach((item) => {
            delete urls[item['url']];
          });
        });
      });
      expect(_.size(urls)).to.equal(0);

    }

  });

  it('must not contain duplicate items', function () {

    var gallerySizes = [10, 50, 100, 250];

    styleParams.galleryWidth = 500;
    styleParams.minItemSize = 160;

    for (var size, i = 0; size = gallerySizes[i]; i++) {
      items = _.cloneDeep(testImages);
      size = Math.min(items.length, size);
      items = items.slice(0, size);

      var urls = {};
      var dups = 0;

      gallery = new Layouter({items, container, styleParams});

      gallery.columns.forEach((column) => {
        column.forEach((group) => {
          group.items.forEach((item) => {
            if (urls[item['url']]) {
              urls[item['url']]++;
              dups++;
            } else {
              urls[item['url']] = 1;
            }
            ;
          });
        });
      });

      expect(dups).to.equal(0);

    }
  });

  it('should have taller Strips as gallerySize increases', function () {
    items = items.slice(0, 100);
    styleParams.isVertical = false;
  
    var gallerySizes = [100, 200, 300, 400];
  
    var lastGroupHeight = 0;
    for (var size, i = 0; size = gallerySizes[i]; i++) {
      styleParams.gallerySize = size;
      gallery = new Layouter({items, container, styleParams});

      var maxGroupHeight = gallery.columns[0].reduce((g, group) => {
        var isLastStrip = (group.stripIdx == gallery.strips);
        return (Math.max(g, (isLastStrip ? 0 : group.height)));
      }, 0);

      expect(maxGroupHeight).to.be.above(lastGroupHeight);

      lastGroupHeight = maxGroupHeight;
    }

  });

  it('should have all groups in a Columns gallery narrower than gallerySize', function () {
    items = items.slice(0, 100);
    styleParams.isVertical = true;
    styleParams.galleryWidth = 1200;

    var gallerySizes = [10, 50, 100, 200, 300, 400]; //must divide exactly in galleyWidth for testing (otherwise might be larger than gallerySize

    var lastGroupWidth = 0;
    for (var size, i = 0; size = gallerySizes[i]; i++) {
      styleParams.gallerySize = size;
      gallery = new Layouter({items, container, styleParams});

      var maxGroupWidth = gallery.columns.reduce((c, column) => {
        return (c && column.reduce((g, group) => {
          return Math.max(g, group.width);
        }, true));
      }, true);

      expect(maxGroupWidth).to.be.above(lastGroupWidth);

      lastGroupWidth = maxGroupWidth;
    }

  });

  it('should have all images in a grid gallery in the required ratio', function () {

    var allowedRounding = 5; //the number of pixels that can change due to rounding

    items = items.slice(0, 100);
    styleParams.cubeImages = true;

    var cubeRatios = [0.25, 0.5, 1, 2, 4];

    for (var ratio, i = 0; ratio = cubeRatios[i]; i++) {
      styleParams.cubeRatio = ratio;
      gallery = new Layouter({items, container, styleParams});
      var isCroppedCorrectly = gallery.columns[0].reduce((g, group) => {
        return (g && group.items.reduce((i, image) => {
          return i && (((image.width - allowedRounding) / (image.height + allowedRounding)) <= image.cubeRatio) && (((image.width + allowedRounding) / (image.height - allowedRounding)) >= image.cubeRatio); //ignore fractions
        }, true));
      }, true);

      expect(isCroppedCorrectly).to.be.true;
    }
  });

  it('should have fixed number of columns if specified', function () {
    items = items.slice(0, 100);
    styleParams.isVertical = true;

    var fixedColumnsNumber = [1, 5, 10, 20];

    for (var num, i = 0; num = fixedColumnsNumber[i]; i++) {
      styleParams.fixedColumns = num;
      gallery = new Layouter({items, container, styleParams});

      expect(gallery.columns.length).to.equal(num);
    }

  });

  it('should have more items in groups when the collageAmount increases', function () {
    items = items.slice(0, 100);

    var collageAmount = Array(12).join('0').split('').map((a, b) => b / 10); //create an array of 0,0.1,0.2...0.9,1 (had to find a way to one line it)

    var lastAvgGroupSize = 0;

    for (var size, i = 0; size = collageAmount[i]; i++) {
      styleParams.collageAmount = size;
      gallery = new Layouter({items, container, styleParams});

      var avgGroupSize = items.length / gallery.columns[0].length;

      expect(avgGroupSize).not.to.be.below(lastAvgGroupSize);

      lastAvgGroupSize = avgGroupSize;
    }
  });

  it('should have all groups at maximum groupSize items', function () {
    items = items.slice(0, 100);

    var groupSizes = [1, 2, 3];

    for (var size, i = 0; size = groupSizes[i]; i++) {
      styleParams.groupSize = size;
      gallery = new Layouter({items, container, styleParams});

      var isWithinSize = gallery.columns[0].reduce((g, group) => {
        var inSize = (group.items.length <= styleParams.groupSize);
        return (g && inSize);
      }, true);

      expect(isWithinSize).to.be.true;
    }

  });

  it('should have groups only from the optional groups types ', function () {
    items = items.slice(0, 100);

    var groupTypes = ['1', '1,2h,2v', '1,3b,3l,3r', '1,2h,2v,3v,3h', '1,3t,3b', '1,3v,3h', '1,3r,3b,3v,3h', '1,2h,2v,3v,3h,3l,3b']; //groupType '1' must always be an option

    for (var type, i = 0; type = groupTypes[i]; i++) {
      styleParams.groupTypes = type;
      gallery = new Layouter({items, container, styleParams});

      var isWithinTypes = gallery.columns[0].reduce((g, group) => {
        var inTypes = (styleParams.groupTypes.indexOf(group.type) >= 0);
        return (g && inTypes);
      }, true);

      expect(isWithinTypes).to.be.true;
    }

  });

  it('should have all Strips GalleryLayout images larger than minItemSize', function () {

    items = items.slice(0, 100);
    styleParams.isVertical = false;

    var minItemSizes = [10, 50, 100, 200, 300, 400];

    for (var size, i = 0; size = minItemSizes[i]; i++) {
      styleParams.gallerySize = size * 4; //gallerySize must be greater than minItemSize (otherwise the images' proportions will affect the minDimension)
      styleParams.minItemSize = size;
      gallery = new Layouter({items, container, styleParams});

      var minItemSize = gallery.columns[0].reduce((g, group) => {
        var isLastStrip = (group.stripIdx == gallery.strips);
        return (isLastStrip ? g : Math.min(g, group.items.reduce((i, item) => {
          var maxDimension = Math.max(item.width, item.height);
          return Math.min(i, maxDimension);
        }, styleParams.minItemSize)));
      }, styleParams.minItemSize);

      expect(minItemSize).not.to.be.below(size / 2);
    }

  });

  it('should have all Columns GalleryLayout images larger than minItemSize', function () {

      items = items.slice(0, 100);
      styleParams.isVertical = true;
      styleParams.galleryWidth = 4000;

      var minItemSizes = [10, 50, 100, 200, 300, 400];

      for (var size, i = 0; size = minItemSizes[i]; i++) {
        styleParams.gallerySize = size * 4; //gallerySize must be greater than minItemSize (otherwise the images' proportions will affect the minDimension)
        styleParams.minItemSize = size;
        gallery = new Layouter({items, container, styleParams});

        var minItemSize = gallery.columns.reduce((c, column) => {
          return (c && column.reduce((g, group) => {
            return (Math.min(g, group.items.reduce((i, item) => {
              var maxDimension = Math.max(item.width, item.height);
              return Math.min(i, maxDimension);
            }, styleParams.minItemSize)));
          }, styleParams.minItemSize));
        }, styleParams.minItemSize);

        expect(minItemSize).not.to.be.below(size);
      }

    }
  );
  
});

function multiplyArray(arr) {
  return [].concat.apply([], arr.map((x) => {
    return [].concat.apply([], arr.map((y) => {
      return [[x, y]];
    }));
  }));
};
