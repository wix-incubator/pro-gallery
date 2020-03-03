import Layouter from '../src/layouter.js';
import { testImages } from './images-mock.js';
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

const getItems = count => deepFreeze(testImages.slice(0, count));
const getGroupCount = layout =>
  layout.columns.reduce((count, column) => count + column.length, 0);

describe('Layouter', () => {
  let gallery;
  let layouter;
  let container = {};
  let styleParams = {};

  const getLayout = layoutParams => layouter.createLayout(layoutParams);

  beforeEach(() => {
    const items = getItems();
    styleParams = {
      oneRow: false,
      isVertical: false,
      gallerySize: 200,
      groupSize: 3,
      groupTypes: '1,2h,2v,3t,3b,3l,3r,3v,3h',
      rotatingGroupTypes: '',
      cubeImages: false,
      cubeType: 'fill',
      cubeRatio: 1,
      smartCrop: false,
      chooseBestGroup: true,
      collageAmount: 0.9,
      collageDensity: 0.9,
      minItemSize: 20,
      layoutsVersion: 2,
      galleryMargin: 0,
      imageMargin: 10,
      floatingImages: 0,
      fixedColumns: 0,
    };

    container = {
      width: 1000,
      bounds: {
        visibleTop: 0,
        visibleBottom: 1000,
        renderedTop: 0,
        renderedBottom: 10000,
      },
    };

    const options = {
      createLayoutOnInit: false,
    };

    layouter = new Layouter({
      items,
      container,
      styleParams,
      options,
    });
  });

  describe('items', () => {
    it('should include all items in original order', () => {
      styleParams.galleryWidth = 500;
      styleParams.minItemSize = 160;

      for (const size of [10, 50, 100]) {
        const items = getItems(size);
        gallery = getLayout({ items, container, styleParams });

        const galleryItemIds = gallery.items.map(item => item.id);
        const itemIds = items.map(item => item.id || item.photoId);

        expect(galleryItemIds).to.deep.equal(itemIds);
      }
    });

    it('should have items offsets and dimensions calculated correctly', () => {
      const items = getItems(100);
      styleParams.galleryWidth = 4000;
      styleParams.gallerySize = 500;
      styleParams.rotatingGroupTypes = '1,2h,2v,3r,3t,3l,3b,3v,3h';
      styleParams.imageMargin = 0;

      gallery = getLayout({ items, container, styleParams });

      gallery.groups.forEach(group => {
        group.items.forEach(item => {
          const widthDiff = Math.abs(
            item.offset.right - item.offset.left - item.width,
          );
          const heightDiff = Math.abs(
            item.offset.bottom - item.offset.top - item.height,
          );
          expect(widthDiff).to.be.below(1);
          expect(heightDiff).to.be.below(1);
        });
      });
    });
  });

  describe('container', () => {
    it('should support legacy container props', () => {
      const items = getItems();

      //old gallries already include the margin compensation
      const containerA = { galleryWidth: 120, galleryHeight: 210 };
      const layouterA = new Layouter({
        items,
        container: containerA,
        styleParams,
      });

      //new galleries don't need to compensate
      const containerB = { width: 100, height: 200 };
      const layouterB = new Layouter({
        items,
        container: containerB,
        styleParams,
      });

      expect(layouterA.container).to.deep.equal(layouterB.container);
    });
  });

  describe('Style Params', () => {
    //gallerySize
    it('should have taller Strips as gallerySize increases', () => {
      const items = getItems(100);
      styleParams.isVertical = false;

      let lastGroupHeight = 0;
      for (const size of [100, 200, 300, 400]) {
        styleParams.gallerySize = size;
        gallery = getLayout({ items, container, styleParams });
        const maxGroupHeight = gallery.columns[0].groups.reduce((g, group) => {
          const isLastStrip = group.stripIdx === gallery.strips.length;
          return Math.max(g, isLastStrip ? 0 : group.height);
        }, 0);

        expect(maxGroupHeight).to.be.above(lastGroupHeight);

        lastGroupHeight = maxGroupHeight;
      }
    });

    //gallerySize
    it('should have all groups in a Columns gallery narrower than gallerySize', () => {
      const items = getItems(100);
      styleParams.isVertical = true;
      styleParams.galleryWidth = 1200;

      let lastGroupWidth = 0;
      for (const size of [10, 50, 100, 200, 300, 400]) {
        styleParams.gallerySize = size;
        gallery = getLayout({ items, container, styleParams });

        const maxGroupWidth = gallery.columns.reduce((c, column) => {
          return (
            c &&
            column.groups.reduce((g, group) => {
              return Math.max(g, group.width);
            }, true)
          );
        }, true);

        expect(maxGroupWidth).to.be.above(lastGroupWidth);

        lastGroupWidth = maxGroupWidth;
      }
    });

    //cubeRatio
    it('should have all images in a grid gallery in the required ratio', () => {
      const allowedRounding = 2; //the number of pixels that can change due to rounding

      const items = getItems(100);
      styleParams.cubeImages = true;
      styleParams.imageMargin = 0;

      for (const ratio of [0.25, 0.5, 1, 2, 4]) {
        styleParams.cubeRatio = ratio;
        gallery = getLayout({ items, container, styleParams });

        const isCroppedCorrectly = gallery.columns[0].groups.reduce(
          (g, group) => {
            return (
              (g && group.isLastGroup) ||
              group.items.reduce((i, image) => {
                //ignore the last group (it is stretched to fill the galleryWidth)
                const isItemCroppedCorrectly =
                  (image.width - allowedRounding) /
                    (image.height + allowedRounding) <=
                    image.cropRatio &&
                  (image.width + allowedRounding) /
                    (image.height - allowedRounding) >=
                    image.cropRatio;
                return i && isItemCroppedCorrectly;
              }, true)
            );
          },
          true,
        );

        expect(isCroppedCorrectly).to.be.true;
      }
    });

    //fixedColumns
    it('should have fixed number of columns if specified', () => {
      const items = getItems(100);
      styleParams.isVertical = true;

      for (const num of [1, 5, 10, 20]) {
        styleParams.fixedColumns = num;
        gallery = getLayout({ items, container, styleParams });

        expect(gallery.columns.length).to.equal(num);
      }
    });

    //collageAmount
    it('should have more items in groups when the collageAmount increases', () => {
      const itemCount = 100;
      const items = getItems(itemCount);
      const collageAmounts = Array.from({ length: 11 }, (_, i) => i).map(
        i => i / 10,
      );
      let lastGroupCount = itemCount;
      styleParams.layoutsVersion = 1;

      for (const collageAmount of collageAmounts) {
        styleParams.collageAmount = collageAmount;
        gallery = getLayout({ items, container, styleParams });
        const groupCount = getGroupCount(gallery);

        expect(groupCount).not.to.be.above(lastGroupCount);

        lastGroupCount = groupCount;
      }
    });

    //collageDensity
    it('should have more items in groups when the collageDensity increases', () => {
      const itemCount = 100;
      const items = getItems(itemCount);

      const collageDensities = Array.from({ length: 11 }, (_, i) => i).map(
        i => i / 10,
      );
      let lastGroupCount = itemCount;

      for (const collageDensity of collageDensities) {
        styleParams.collageDensity = collageDensity;
        gallery = getLayout({ items, container, styleParams });
        const groupCount = getGroupCount(gallery);

        expect(groupCount).not.to.be.above(lastGroupCount);

        lastGroupCount = groupCount;
      }
    });

    //groupSize
    it('should have all groups at maximum groupSize items', () => {
      const items = getItems(100);

      for (const size of [1, 2, 3]) {
        styleParams.groupSize = size;
        gallery = getLayout({ items, container, styleParams });

        const isWithinSize = gallery.columns[0].groups.reduce((g, group) => {
          const inSize = group.items.length <= styleParams.groupSize;
          return g && inSize;
        }, true);

        expect(isWithinSize).to.be.true;
      }
    });

    //groupTypes
    it('should have groups only from the optional groups types ', () => {
      const items = getItems(100);

      const groupTypes = [
        '1',
        '1,2h,2v',
        '1,3b,3l,3r',
        '1,2h,2v,3v,3h',
        '1,3t,3b',
        '1,3v,3h',
        '1,3r,3b,3v,3h',
        '1,2h,2v,3v,3h,3l,3b',
      ]; //groupType '1' must always be an option

      for (const type of groupTypes) {
        styleParams.groupTypes = type;
        gallery = getLayout({ items, container, styleParams });

        const isWithinTypes = gallery.columns[0].groups.reduce((g, group) => {
          const inTypes = styleParams.groupTypes.indexOf(group.type) >= 0;
          return g && inTypes;
        }, true);

        expect(isWithinTypes).to.be.true;
      }
    });

    //minItemSize
    it('should have all Strips GalleryLayout images larger than minItemSize', () => {
      const items = getItems(100);
      styleParams.isVertical = false;
      styleParams.imageMargin = 0;

      const minItemSizes = [10, 50, 100, 200, 300, 400];

      for (const size of minItemSizes) {
        styleParams.gallerySize = size * 4; //gallerySize must be greater than minItemSize (otherwise the images' proportions will affect the minDimension)
        styleParams.minItemSize = size;
        gallery = getLayout({ items, container, styleParams });

        const minItemSize = gallery.columns[0].groups.reduce((g, group) => {
          return group.items.reduce((i, item) => {
            const minDimension = Math.min(item.width, item.height);
            return Math.min(i, minDimension);
          }, styleParams.minItemSize);
        }, styleParams.minItemSize);

        expect(minItemSize).not.to.be.below(size);
      }
    });

    //minItemSize
    it('should have all Columns GalleryLayout images larger than minItemSize', () => {
      const items = getItems(100);
      styleParams.isVertical = true;
      styleParams.galleryWidth = 4000;
      styleParams.imageMargin = 0;
      styleParams.collageDensity = 1;

      const minItemSizes = [10, 50, 100, 200, 300];

      for (const size of minItemSizes) {
        styleParams.gallerySize = size * 8; //gallerySize must be greater than minItemSize (otherwise the images' proportions will affect the minDimension)
        styleParams.minItemSize = size;
        gallery = getLayout({ items, container, styleParams });

        const minItemSize = gallery.columns.reduce((c, column) => {
          return (
            c &&
            column.groups.reduce((g, group) => {
              return Math.min(
                g,
                group.items.reduce((i, item) => {
                  const maxDimension = Math.max(item.width, item.height);
                  return Math.min(i, maxDimension);
                }, styleParams.minItemSize),
              );
            }, styleParams.minItemSize)
          );
        }, styleParams.minItemSize);

        expect(minItemSize).not.to.be.below(size);
      }
    });

    // isVertical
    it('should create vertical layouts if isVertical is true', () => {
      const items = getItems(100);
      styleParams.gallerySize = 200;
      styleParams.fixedColumns = 0;
      container.galleryWidth = 1000;

      styleParams.isVertical = true;
      gallery = getLayout({ items, container, styleParams });
      expect(gallery.columns.length).to.equal(5);

      styleParams.isVertical = false;
      gallery = getLayout({ items, container, styleParams });
      expect(gallery.columns.length).to.equal(1);
    });

    // oneRow
    it('should create one long row of items if oneRow is true', () => {
      const items = getItems(100);
      container.galleryHeight = 500;

      styleParams.oneRow = false;
      styleParams.imageMargin = 0;

      gallery = getLayout({ items, container, styleParams });
      expect(gallery.height).to.be.above(container.galleryHeight);

      styleParams.oneRow = true;
      gallery = getLayout({ items, container, styleParams });
      expect(gallery.height).to.equal(container.galleryHeight);
    });

    // rotatingGroupTypes
    it('should have groups from the rotating groups types by their order ', () => {
      const items = getItems(100);
      styleParams.isVertical = false;

      const groupTypes = [
        '1',
        '1,2h,2v',
        '1,3b,1,3r',
        '1,2h,2v,3v,3h',
        '1,3t,3b',
        '1,3v,3h',
        '1,3r,2h,3v,3h',
        '2h,2v,3v,3h,3l,3b',
      ];

      for (const type of groupTypes) {
        styleParams.rotatingGroupTypes = type;
        gallery = getLayout({ items, container, styleParams });

        const isWithinTypes = gallery.columns[0].groups.reduce(
          (g, group, idx) => {
            const rotatingGroupTypes = styleParams.rotatingGroupTypes.split(
              ',',
            );
            const expectedType =
              rotatingGroupTypes[idx % rotatingGroupTypes.length];
            const groupType = group.type;
            expect(expectedType).to.equal(groupType);
            const isType = expectedType === groupType;
            return g && isType;
          },
          true,
        );

        expect(isWithinTypes).to.be.true;
      }
    });

    // cubeImages
    it('should have all images in their original ratio if cubeImages is false', () => {
      const allowedRounding = 2; //the number of pixels that can change due to rounding

      const items = getItems(100); //todo - something breaks when using exactly 100 images
      styleParams.cubeImages = false;
      styleParams.imageMargin = 0;
      styleParams.collageDensity = 0.8;

      gallery = getLayout({ items, container, styleParams });
      const isOriginalDimensions = gallery.columns[0].groups.reduce(
        (g, group) => {
          return (
            (g && group.isLastGroup) ||
            group.items.reduce((i, image) => {
              //ignore the last group (it is stretched to fill the galleryWidth)
              const isItemCroppedCorrectly =
                (image.width - allowedRounding) /
                  (image.height + allowedRounding) <=
                  image.maxWidth / image.maxHeight &&
                (image.width + allowedRounding) /
                  (image.height - allowedRounding) >=
                  image.maxWidth / image.maxHeight;
              return i && isItemCroppedCorrectly; //ignore fractions
            }, true)
          );
        },
        true,
      );

      expect(isOriginalDimensions).to.be.true;

      styleParams.cubeImages = true;

      gallery = getLayout({ items, container, styleParams });
      const isCroppedCorrectly = gallery.columns[0].groups.reduce(
        (g, group) => {
          return (
            g &&
            group.items.reduce((i, image) => {
              const isItemCroppedCorrectly =
                (image.width - allowedRounding) /
                  (image.height + allowedRounding) <=
                  styleParams.cubeRatio &&
                (image.width + allowedRounding) /
                  (image.height - allowedRounding) >=
                  styleParams.cubeRatio;
              return i && isItemCroppedCorrectly;
            }, true)
          );
        },
        true,
      );

      expect(isCroppedCorrectly).to.be.true;
    });

    // smartCrop
    it('should crop images according to their original proportions if smartCrop is true', () => {
      const allowedRounding = 2; //the number of pixels that can change due to rounding

      const items = getItems(100);
      styleParams.cubeRatio = 2;
      styleParams.cubeImages = true;
      styleParams.smartCrop = true;
      styleParams.imageMargin = 0;

      gallery = getLayout({ items, container, styleParams });
      const isCroppedCorrectly = gallery.columns[0].groups.reduce(
        (g, group) => {
          return (
            g &&
            group.items.reduce((i, image) => {
              const cropRatio = image.isLandscape
                ? styleParams.cubeRatio
                : 1 / styleParams.cubeRatio;
              const isItemCroppedCorrectly =
                (image.width - allowedRounding) /
                  (image.height + allowedRounding) <=
                  cropRatio &&
                (image.width + allowedRounding) /
                  (image.height - allowedRounding) >=
                  cropRatio;
              return i && isItemCroppedCorrectly;
            }, true)
          );
        },
        true,
      );

      expect(isCroppedCorrectly).to.be.true;
    });

    // chooseBestGroup
    it('should not allow ugly groups if chooseBestGroup is true ', () => {
      const items = getItems(99);
      styleParams.groupTypes = '3t,3r,3l,3b'; //without 1
      styleParams.groupSize = 3;
      styleParams.collageDensity = 1;
      styleParams.minItemSize = 10;
      styleParams.gallerySize = 1000;

      for (const chooseBestGroup of [true, false]) {
        styleParams.chooseBestGroup = chooseBestGroup;

        gallery = getLayout({ items, container, styleParams });
        const isWithinTypes = gallery.columns[0].groups.reduce((g, group) => {
          const groupType = group.type;
          const isType = groupType !== '1'; //if ChoooseBestGroup is true, some group will have to be single
          return g && isType;
        }, true);

        expect(isWithinTypes).to.not.equal(chooseBestGroup);
      }
    });

    // imageMargin (between groups)
    it('should have spaces between groups equal to imageMargin', () => {
      const items = getItems(100);
      styleParams.galleryWidth = 4000;
      styleParams.gallerySize = 500;
      styleParams.groupSize = 1;

      for (const margin of [10, 50, 100, 200]) {
        styleParams.imageMargin = margin;
        gallery = getLayout({ items, container, styleParams });

        let lastItem = false;
        let marginDiff = 0;
        const totalMarginDiff = gallery.items.reduce((i, item) => {
          if (lastItem) {
            let realMargin;
            if (lastItem.offset.top === item.offset.top) {
              realMargin = Math.round(item.offset.left - lastItem.offset.right);
            } else {
              realMargin = Math.round(item.offset.top - lastItem.offset.bottom);
            }
            marginDiff = Math.abs(realMargin - margin * 2);
            expect(marginDiff).to.be.below(1);
          }
          lastItem = item;
          return i + Math.floor(marginDiff);
        }, 0);

        expect(totalMarginDiff).to.be.below(1);
      }
    });

    // imageMargin (within groups)
    //TODO fix this test once the playground is complete
    it('should have spaces between items in a group equal to imageMargin', () => {
      const items = getItems(100);
      styleParams.galleryWidth = 4000;
      styleParams.gallerySize = 1000;
      styleParams.groupSize = 3;
      styleParams.groupTypes = '1,2h,2v,3r,3t,3l,3b,3v,3h';

      for (const margin of [0, 30, 40, 80]) {
        styleParams.imageMargin = margin;
        gallery = getLayout({ items, container, styleParams });

        let marginDiff = 0;
        gallery.columns[0].groups.reduce((g, group) => {
          let lastItem = false;
          const groupMarginDiff = group.items.reduce((i, item) => {
            if (lastItem) {
              let realMargin;
              if (lastItem.offset.top < item.offset.top) {
                realMargin = Math.round(
                  item.offset.top - lastItem.offset.bottom,
                );
              } else {
                realMargin = Math.round(
                  item.offset.left - lastItem.offset.right,
                );
              }
              marginDiff = Math.abs(realMargin - margin * 2);
              expect(marginDiff).to.be.below(2);
            }
            lastItem = item;
            return i + Math.floor(marginDiff);
          }, 0);
          return g + groupMarginDiff;
        }, 0);
      }
    });

    // rotatingGroupTypes
    it('should type groups according to rotatingGroupTypes if defined', () => {
      const items = getItems(100); //todo - something breaks when using exactly 100 images
      styleParams.rotatingGroupTypes = '2h,3v,3b,3t,1,2h,2v';
      const rotatingGroupTypesArr = styleParams.rotatingGroupTypes.split(',');

      gallery = getLayout({ items, container, styleParams });
      gallery.groups.forEach((group, g) => {
        expect(group.type).to.equal(
          rotatingGroupTypesArr[g % rotatingGroupTypesArr.length],
        ); //first group idx is 1
      }, true);
    });

    // functional cropRatio
    it('should crop items according to the cropRatio function if defined', () => {
      const items = getItems(100); //todo - something breaks when using exactly 100 images
      styleParams.cropRatio = () => Math.random();
      styleParams.cropItems = true;
      styleParams.smartCrop = false;

      gallery = getLayout({ items, container, styleParams });

      gallery.items.reduce((i, item) => {
        expect(item.cropRatio).to.not.equal(i);
        return item.cropRatio;
      }, 0);
    });

    // crop only fill
    it('should not crop items if cropOnlyFill is true and cropType is fit', () => {
      const items = getItems(100); //todo - something breaks when using exactly 100 images
      styleParams.cropRatio = 1;
      styleParams.cropOnlyFill = true;
      styleParams.cubeType = 'fit';
      styleParams.cropItems = true;
      styleParams.smartCrop = false;

      gallery = getLayout({ items, container, styleParams });

      gallery.items.forEach(item => {
        expect(item.cropRatio).to.equal(item.ratio);
      });
    });

    // rotatingCropRatios
    it('should crop items according to rotatingCropRatios if defined', () => {
      const items = getItems(100); //todo - something breaks when using exactly 100 images
      styleParams.rotatingCropRatios = [2, 1.5, 1.2, 0.5, 1];
      styleParams.cropRatio = '1';
      styleParams.cropItems = true;
      styleParams.smartCrop = false;
      styleParams.isVertical = true;

      const rotatingCropRatiosArr = styleParams.rotatingCropRatios; //.split(',');

      gallery = getLayout({ items, container, styleParams });
      gallery.items.forEach((item, i) => {
        const ratio = Number(
          rotatingCropRatiosArr[i % rotatingCropRatiosArr.length],
        );
        const { width, height } = item.style;
        const itemRatio = width / height;
        const diff = Math.abs(itemRatio - ratio);

        expect(diff).to.be.below(ratio / 10);
      }, true);
    });
  });

  describe('Infinite Scroll', () => {
    it('scroll should increase visible items range', () => {
      const items = getItems(100);

      styleParams.isVertical = true;
      styleParams.fixedColumns = 2;
      styleParams.groupSize = 1;

      container.galleryWidth = 1000;
      container.galleryHeight = 1000;

      const isVisible = itemIdx => {
        const item = gallery.items[itemIdx];
        return !!item && item.visibility.visible;
      };

      const visibleItemsRange = _items => {
        let from = false;
        let to = false;
        for (const item of _items) {
          if (isVisible(item.idx)) {
            if (from === false) {
              from = item.idx;
            }
          } else if (to === false && from !== false) {
            to = item.idx - 1;
          }
        }
        return [from, to];
      };

      const scroll = base => {
        return {
          renderedTop: base - 3000,
          visibleTop: base,
          visibleBottom: base + 1000,
          renderedBottom: base + 4000,
        };
      };

      let lastFrom = -1;
      let lastTo = -1;

      const boundsOptions = [0, 1000, 2500, 6000].map(base => scroll(base));
      gallery = layouter.createLayout({ items, container, styleParams });

      for (const bounds of boundsOptions) {
        gallery = layouter.calcVisibilities(bounds);

        const [from, to] = visibleItemsRange(gallery.items);

        expect(isVisible(from - 1)).to.be.false;
        expect(isVisible(from)).to.be.true;
        expect(isVisible(to)).to.be.true;
        expect(isVisible(to + 1)).to.be.false;

        expect(lastFrom).to.be.below(from);
        expect(lastTo).to.be.below(to);

        lastFrom = from;
        lastTo = to;
      }
    });
  });

  describe('public methods', () => {
    it('findLastVisibleItemIdx should work', () => {
      const items = getItems(100);

      styleParams.isVertical = true;
      styleParams.fixedColumns = 1;
      styleParams.groupSize = 1;

      container.galleryWidth = 1000;

      const galleryHeights = [500, 1000, 2500, 6000];

      for (const galleryHeight of galleryHeights) {
        container.galleryHeight = galleryHeight;
        gallery = layouter.createLayout({ items, container, styleParams });

        const lastVisibleItemIdx = layouter.lastVisibleItemIdx();
        const lastVisibleItem = gallery.items[lastVisibleItemIdx];
        const firstHiddenItem = gallery.items[lastVisibleItemIdx + 1];

        expect(lastVisibleItem.offset.top).to.be.below(galleryHeight);
        expect(firstHiddenItem.offset.top).to.be.above(galleryHeight);
      }
    });

    it('findNeighborItem should work', () => {
      let neighbor;

      const items = getItems(100);

      styleParams.isVertical = true;
      styleParams.cubeImages = true;
      styleParams.cubeRatio = 1;
      styleParams.groupSize = 1;

      container.galleryWidth = 1000;

      for (const fixedColumns of [2, 3, 5, 7]) {
        styleParams.fixedColumns = fixedColumns;
        gallery = layouter.createLayout({ items, container, styleParams });

        for (const item of gallery.items) {
          if (item.idx > fixedColumns) {
            neighbor = layouter.findNeighborItem(item.idx, 'up');
            expect(item.idx - neighbor).to.equal(fixedColumns);
          }

          if (item.idx < gallery.items.length - fixedColumns - 1) {
            neighbor = layouter.findNeighborItem(item.idx, 'down');
            expect(neighbor - item.idx).to.equal(fixedColumns);
          }

          if (item.idx % fixedColumns > 0) {
            neighbor = layouter.findNeighborItem(item.idx, 'left');
            expect(item.idx - neighbor).to.equal(1);
          }

          if (
            item.idx % fixedColumns < fixedColumns - 1 &&
            item.idx < gallery.items.length - 1
          ) {
            neighbor = layouter.findNeighborItem(item.idx, 'right');
            expect(neighbor - item.idx).to.equal(1);
          }
        }
      }
    });
  });
});
