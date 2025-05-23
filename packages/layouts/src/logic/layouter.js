/* eslint-disable prettier/prettier */
import { utils } from './utils.js';
import { Item } from './item.js';
import { Group } from './group.js';
import { Strip } from './strip.js';
import { Column } from './column.js';
import layoutsStore from './layoutsStore.js';
import { optionsMap } from 'pro-gallery-lib';

export default class Layouter {
  constructor(layoutParams) {
    //dummy commit
    this.ready = false;
    this.pointer = 0;
    this.layoutItems = [];

    this.findNeighborItem = this.findNeighborItem.bind(this);

    this.updateParams(layoutParams);

    if (this.createLayoutOnInit !== false) {
      this.createLayout(layoutParams);
    }
  }

  updateParams(layoutParams) {
    this.srcItems = layoutParams.items;
    this.styleParams = utils.addDefaultStyleParams(layoutParams.styleParams);
    this.container = utils.convertContainer(
      layoutParams.container,
      this.styleParams
    );

    const options = layoutParams.options || {};
    this.useExistingLayout = !!options.useExistingLayout;
    this.createLayoutOnInit = options.createLayoutOnInit;
    this.showAllItems = !!options.showAllItems || !!layoutParams.showAllItems;
    this.useLayoutStore = !!options.useLayoutStore;
  }

  verifyGalleryState() {
    if (!this.container.galleryWidth) {
      this.ready = false;
      throw new Error(
        'Layouter: cannot create layout, galleryWidth is undefined or 0'
      );
    }

    if (!this.styleParams.targetItemSize) {
      this.ready = false;
      throw new Error(
        'Layouter: cannot create layout, targetItemSize is undefined or 0'
      );
    }
  }

  calcNumberOfColumns(galleryWidth, targetItemSize) {
    let numOfCols = 1;
    if (this.styleParams[optionsMap.layoutParams.structure.layoutOrientation] === 'VERTICAL') {
      if (this.styleParams.fixedColumns > 0) {
        numOfCols = this.styleParams.fixedColumns;
      
      } else {
        // find the number of columns that makes each column width the closet to the targetItemSize
        const numOfColsFloat = galleryWidth / targetItemSize;
        const roundFuncs = [Math.floor, Math.ceil];
        const diffs = roundFuncs
          .map((func) => func(numOfColsFloat)) //round to top, round to bottom
          .map((n) => Math.round(galleryWidth / n)) //width of each col
          .map((w) => Math.abs(targetItemSize - w)); //diff from targetItemSize
        const roundFunc = roundFuncs[diffs.indexOf(Math.min(...diffs))]; //choose the round function that has the lowest diff from the targetItemSize
        numOfCols = roundFunc(numOfColsFloat) || 1;
      }
    } else {
      numOfCols = 1;
    }
    return numOfCols;
  }

  findShortestColumn(columns, groupIdx) {
    let minCol = columns[0];
    if (this.styleParams[optionsMap.layoutParams.structure.groupsOrder] === 'LEFT_TO_RIGHT') {
      minCol = columns[groupIdx % columns.length];
    } else {
      let minColH = -1;
      for (const column of columns) {
        const colH = column.height;
        if (colH < minColH || minColH < 0) {
          minColH = colH;
          minCol = column;
        }
      }
    }
    return minCol;
  }

  saveExistingLayout() {
    if (this.useLayoutStore) {
      layoutsStore.layout = {
        pointer: this.pointer,
        layoutItems: this.layoutItems,
        groups: this.groups,
        strips: this.strips,
        groupIdx: this.groupIdx,
        groupItems: this.groupItems,
        group: this.group,
        strip: this.strip,
        targetItemSize: this.targetItemSize,
        galleryHeight: this.galleryHeight,
        columns: this.columns,
      };
    }
  }

  prepareLayoutParams() {
    if (this.useExistingLayout && this.pointer > 0) {
      if (this.useLayoutStore) {
        Object.assign(this, layoutsStore.layout);
      } else {
        if (this.styleParams[optionsMap.layoutParams.structure.layoutOrientation] === 'VERTICAL') {
          //---------------------| COLUMNS GALLERY |----------------------//
          //remove items from the last 3 groups;
          const lastGroups = this.groups.slice(-3);
          lastGroups.forEach((group) => {
            const column = this.columns[group.columnIdx];
            if (column) {
              column.height -= group.totalHeight;
              column.groups.splice(-1, 1);
            }
            this.groups.splice(-1, 1);
            group.realItems.forEach(() => {
              this.layoutItems.splice(-1, 1);
              this.pointer--;
            });
            this.groupIdx--;
          });
        } else {
          //---------------------| STRIPS GALLERY |----------------------//
          if (this.scrollDirection === 'HORIZONTAL') {
            //remove items from the last group:
            const lastGroups = this.groups.slice(-1);
            lastGroups.forEach((group) => {
              const column = this.columns[0];
              if (column) {
                column.groups.splice(-1, 1);
              }
              const strip = this.strips[0];
              if (strip) {
                strip.setWidth(strip.width - group.width);
                strip.ratio = strip.width / strip.height;
                strip.groups.splice(-1, 1);
                this.strip = strip;
              }
              this.strips = [];

              this.groups.splice(-1, 1);
              group.realItems.forEach(() => {
                this.layoutItems.splice(-1, 1);
                this.pointer--;
              });
              this.groupIdx--;
            });
            this.galleryHeight = 0;
          } else {
            //remove items from the last 2 strips;
            const lastStrips = this.strips.slice(-2);
            if (lastStrips) {
              lastStrips.forEach((lastStrip) => {
                if (lastStrip) {
                  this.strips.splice(-1, 1);
                  const groups = lastStrip.groups;
                  groups.forEach((group) => {
                    this.groups.splice(-1, 1);
                    group.items.forEach(() => {
                      this.layoutItems.splice(-1, 1);
                      this.pointer--;
                    });
                    this.groupIdx--;
                  });
                }
              });
              this.galleryHeight = this.strips.reduce(
                (totalHeight, strip) => (totalHeight += strip.height),
                0
              );
              // this.strip = this.strips[this.strips.length - 1];
              this.strip = new Strip({
                idx: this.strips.length + 1,
                container: this.container,
                groupsPerStrip: this.styleParams[optionsMap.layoutParams.groups.numberOfGroupsPerRow],
                scrollDirection: this.styleParams[optionsMap.layoutParams.structure.scrollDirection],
                targetItemSize: this.targetItemSize,
              });
            }
          }

          this.groupItems = [];
        }
      }

      this.item = {};
      this.pointer = Math.max(0, this.pointer);
      this.maxLoops = this.srcItems.length * 10;
    } else {
      this.pointer = 0;
      this.firstGroup = false;
      this.layoutItems = [];
      this.groups = [];
      this.strips = [];

      if (this.styleParams.forceFullHeight) { //v5 TODO check and remove this API
        this.targetItemSize = Math.sqrt(
          (this.container.galleryHeight * this.container.galleryWidth) /
            this.srcItems.length
        );
      } else {
        let gallerySizeVal;
        if (typeof this.styleParams.targetItemSize === 'function') {
          gallerySizeVal = this.styleParams.targetItemSize();
        } else {
          gallerySizeVal = this.styleParams.targetItemSize;
        }
        this.targetItemSize =
          Math.floor(gallerySizeVal) +
          Math.ceil(
            2 *
              (this.styleParams[optionsMap.layoutParams.structure.itemSpacing] / 2 -
                this.styleParams[optionsMap.layoutParams.structure.gallerySpacing])
          );
      }

      this.galleryWidth = Math.floor(this.container.galleryWidth);
      this.maxGroupSize = this.getMaxGroupSize();

      this.groupIdx = 0;
      this.item = {};

      this.groupItems = [];
      this.group = {};
      this.bounds = this.container.bounds || {};

      this.strip = new Strip({
        idx: 1,
        container: this.container,
        groupsPerStrip: this.styleParams[optionsMap.layoutParams.groups.numberOfGroupsPerRow],
        scrollDirection: this.styleParams[optionsMap.layoutParams.structure.scrollDirection],
        targetItemSize: this.targetItemSize,
      });

      this.galleryHeight = 0;

      this.numOfCols = this.calcNumberOfColumns(
        this.galleryWidth,
        this.targetItemSize
      );
      this.targetItemSize = this.styleParams[optionsMap.layoutParams.structure.layoutOrientation] === 'VERTICAL'
        ? Math.floor(this.galleryWidth / this.numOfCols)
        : this.targetItemSize;

      const { externalInfoWidth } =
        this.styleParams;
        const columnWidths = this.styleParams[optionsMap.layoutParams.structure.columnRatios]
        const imageMargin = this.styleParams[optionsMap.layoutParams.structure.itemSpacing]
      const cropRatio = this.styleParams[optionsMap.layoutParams.crop.ratios];
      let columnWidthsArr = false;
      if (columnWidths && columnWidths.length > 0) {
        columnWidthsArr = columnWidths.map(Number);
        while (columnWidthsArr.length < this.numOfCols) {
          columnWidthsArr.push(...columnWidthsArr);
        }
        columnWidthsArr = columnWidthsArr.slice(0, this.numOfCols);
        const columnMultiplier =
          this.galleryWidth / columnWidthsArr.reduce((a, b) => a + b, 0);
        columnWidthsArr = columnWidthsArr.map((col) =>
          Math.round((col *= columnMultiplier))
        );
      }

      let totalLeft = 0;
      let remainderWidth = this.galleryWidth;
      let fixedCubeHeight;
      this.columns = Array(this.numOfCols)
        .fill(0)
        .map((column, idx) => {
          //round group widths to fit an even number of pixels
          let colWidth = columnWidthsArr
            ? columnWidthsArr[idx]
            : Math.round(remainderWidth / (this.numOfCols - idx));
          const curLeft = totalLeft;
          totalLeft += colWidth;
          remainderWidth -= colWidth;
          //fix cropRatio of rounded columns
          const infoWidth =
            Math.round(
              externalInfoWidth > 1 // integer represent size in pixels, floats size in percentage
                ? externalInfoWidth
                : externalInfoWidth * colWidth
            ) || 0;
          colWidth -= infoWidth;
          fixedCubeHeight =
            fixedCubeHeight ||
            (this.targetItemSize - infoWidth - imageMargin) / cropRatio[0] + //v5 check how this works if there are multiple ratios or if this is a function......wtf
              imageMargin; //calc the cube height only once
          //add space for info on the side
          return new Column(idx, colWidth, curLeft, fixedCubeHeight, infoWidth);
        });
      this.maxLoops = this.srcItems.length * 10;
    }
  }

  createLayout(layoutParams) {
    if (typeof layoutParams !== 'undefined') {
      this.updateParams(layoutParams);
    }

    this.verifyGalleryState();

    this.prepareLayoutParams();

    while (this.srcItems[this.pointer]) {
      if (this.imagesLeft === 6) {
        this.saveExistingLayout();
      }

      this.maxLoops--;
      if (this.maxLoops <= 0) {
        console.error('Cannot create layout, maxLoops reached!!!');
        return false;
      }

      this.item = new Item({
        idx: this.pointer,
        inGroupIdx: this.groupItems.length + 1,
        scrollTop: this.galleryHeight,
        dto: this.srcItems[this.pointer],
        container: this.container,
        styleParams: this.styleParams,
      });

      this.layoutItems[this.pointer] = this.item;

      //push the image to a group - until its full
      this.groupItems.push(this.item);
      if (
        this.groupItems.length < this.maxGroupSize &&
        this.srcItems[this.pointer + 1]
      ) {
        this.pointer++;
        continue;
      }

      this.group = new Group({
        idx: this.groupIdx,
        stripIdx: this.strip.idx,
        inStripIdx: this.strip.groups.length + 1,
        top: this.galleryHeight,
        items: this.groupItems,
        isLastItems: this.isLastImages,
        targetItemSize: this.targetItemSize,
        showAllItems: this.showAllItems,
        container: this.container,
        styleParams: this.styleParams,
      });
      this.groups[this.groupIdx] = this.group;

      //take back the pointer in case the group was created with less items
      this.pointer += this.group.realItems.length - this.groupItems.length;

      this.groupIdx++;
      this.groupItems = [];

      //resize and fit the group in the strip / column
      if (this.styleParams[optionsMap.layoutParams.structure.layoutOrientation] === 'HORIZONTAL') {
        //---------------------| STRIPS GALLERY |----------------------//

        if (this.strip.isFull(this.group, this.isLastImage)) {
          //close the current strip
          this.strip.resizeToHeight(this.galleryWidth / this.strip.ratio);
          this.strip.setWidth(this.galleryWidth);
          this.galleryHeight += this.strip.height;
          this.columns[0].addGroups(this.strip.groups);
          this.strips.push(this.strip);

          //open a new strip
          this.strip = new Strip({
            idx: this.strip.idx + 1,
            container: this.container,
            groupsPerStrip: this.styleParams[optionsMap.layoutParams.groups.numberOfGroupsPerRow],
            scrollDirection: this.styleParams[optionsMap.layoutParams.structure.scrollDirection],
            targetItemSize: this.targetItemSize,
          });

          //reset the group (this group will be rebuilt)
          this.pointer -= this.group.realItems.length - 1;
          this.groupIdx--;
          continue;
        }

        //add the group to the (current/new) strip
        this.group.setTop(this.galleryHeight);
        this.strip.ratio += this.group.ratio;
        // this.strip.height = Math.min(targetItemSize, (galleryWidth / this.strip.ratio));
        this.strip.height = this.galleryWidth / this.strip.ratio;
        this.strip.setWidth(this.galleryWidth);
        this.strip.addGroup(this.group);

        if (this.isLastImage && this.strip.hasGroups) {
          if (this.styleParams[optionsMap.layoutParams.structure.scrollDirection] === 'HORIZONTAL') {
            this.strip.height =
              this.container.galleryHeight +
              (this.styleParams[optionsMap.layoutParams.structure.itemSpacing] / 2 -
                this.styleParams[optionsMap.layoutParams.structure.gallerySpacing]);
          } else if (this.strip.canRemainIncomplete()) {
            //stretching the this.strip to the full width will make it too high - so make it as high as the targetItemSize and not stretch
            this.strip.height = this.targetItemSize;
            this.strip.markAsIncomplete();
          }

          this.strip.resizeToHeight(this.strip.height);
          this.galleryHeight += this.strip.height;
          this.columns[0].addGroups(this.strip.groups);
          this.strips.push(this.strip);
        }
      } else {
        //---------------------| COLUMNS GALLERY |----------------------//

        //find the shortest column
        const minCol = this.findShortestColumn(
          this.columns,
          this.groups.length - 1
        );

        //resize the group and images
        this.group.setCubedHeight(minCol.cubedHeight); //fix last column's items ratio (caused by stretching it to fill the screen)
        this.group.resizeToWidth(minCol.width);
        this.group.round();

        //update the group's position
        this.group.setTop(minCol.height);
        this.group.setLeft(minCol.left);

        //add the image to the column
        minCol.addGroup(this.group);

        //add the image height to the column
        minCol.height += this.group.totalHeight;

        if (this.galleryHeight < minCol.height) {
          this.galleryHeight = minCol.height;
        }
      }

      if (!this.firstGroup) {
        this.firstGroup = this.group;
      }

      this.pointer++;
    }

    if (this.styleParams.forceFullHeight) { //v5 TODO check and remove this API
      const stretchRatio = this.container.galleryHeight / this.galleryHeight;
      this.items.map((item) => {
        item.cubeImages = true;
        item.cropRatio = item.ratio = item.width / (item.height * stretchRatio);
        item.height *= stretchRatio;
        return item;
      });
      this.groups.map((group) => {
        group.height *= stretchRatio;
        group.setTop(group.top * stretchRatio);
        group.resizeItems();
        return group;
      });
    }

    //results
    this.lastGroup = this.group;
    this.colWidth = Math.floor(this.galleryWidth / this.numOfCols);
    this.height =
      this.galleryHeight -
      (this.styleParams[optionsMap.layoutParams.structure.itemSpacing] / 2 - this.styleParams[optionsMap.layoutParams.structure.gallerySpacing]) * 2;

    this.width = this.lastGroup.left + this.lastGroup.width;

    this.ready = true;

    return this.scheme;
  }

  lastVisibleItemIdxInHeight(height) {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      const isVisible = item.offset.top < height;
      if (isVisible) {
        return i;
      }
    }
    return this.items.length - 1;
  }

  lastVisibleItemIdx() {
    //the item must be visible and about the show more button
    return this.lastVisibleItemIdxInHeight(this.container.galleryHeight - 100);
  }

  findNeighborItem(itemIdx, dir) {
    const currentItem = this.layoutItems[itemIdx];

    let neighborItem;

    const findClosestItem = (currentItemX, currentItemY, condition) => {
      let minDistance = null;
      let minDistanceItem = {};

      let itemY;
      let itemX;
      let distance;

      // each(slice(this.layoutItems, itemIdx - 50, itemIdx + 50), (item) => {
      this.layoutItems.forEach((item) => {
        itemY = item.offset.top + item.height / 2;
        itemX = item.offset.left + item.width / 2;
        distance = Math.sqrt(
          Math.pow(itemY - currentItemY, 2) + Math.pow(itemX - currentItemX, 2)
        );
        if (
          (minDistance === null || (distance > 0 && distance < minDistance)) &&
          condition(currentItemX, currentItemY, itemX, itemY)
        ) {
          minDistance = distance;
          minDistanceItem = item;
        }
      });
      return minDistanceItem;
    };

    switch (dir) {
      case 'up':
        neighborItem = findClosestItem(
          currentItem.offset.left + currentItem.width / 2,
          currentItem.offset.top,
          (curX, curY, itmX, itmY) => itmY < curY
        );
        break;

      case 'left':
        neighborItem = findClosestItem(
          currentItem.offset.left,
          currentItem.offset.top + currentItem.height / 2,
          (curX, curY, itmX) => itmX < curX
        );
        break;

      case 'down':
        neighborItem = findClosestItem(
          currentItem.offset.left + currentItem.width / 2,
          currentItem.offset.bottom,
          (curX, curY, itmX, itmY) => itmY > curY
        );
        break;

      default:
      case 'right':
        neighborItem = findClosestItem(
          currentItem.offset.right,
          currentItem.offset.top + currentItem.height / 2,
          (curX, curY, itmX) => itmX > curX
        );
        break;
    }

    if (neighborItem.idx >= 0) {
      return neighborItem.idx;
    } else {
      console.warn('Could not find offset for itemIdx', itemIdx, dir);
      return itemIdx; //stay on the same item
    }
  }

  getMaxGroupSize() {
    let _maxGroupSize = 1;
    try {
      const groupTypes =
        typeof this.styleParams[optionsMap.layoutParams.groups.allowedGroupTypes] === 'string' &&
        this.styleParams[optionsMap.layoutParams.groups.allowedGroupTypes].length > 0
          ? this.styleParams[optionsMap.layoutParams.groups.allowedGroupTypes].split(',')
          : this.styleParams[optionsMap.layoutParams.groups.allowedGroupTypes];
      _maxGroupSize =
        groupTypes.length > 0
          ? groupTypes.reduce(
              (curSize, groupType) => Math.max(curSize, parseInt(groupType)),
              1
            )
          : Number(groupTypes);
      _maxGroupSize = Math.min(_maxGroupSize, this.styleParams[optionsMap.layoutParams.groups.groupSize]);
    } catch (e) {
      console.error("couldn't calculate max group size - returing 3 (?)", e);
      _maxGroupSize = 3;
    }
    return _maxGroupSize;
  }

  get isLastImage() {
    return !this.srcItems[this.pointer + 1];
  }

  get isLastImages() {
    return !this.srcItems[this.pointer + 1];
  }

  get imagesLeft() {
    return this.srcItems.length - this.pointer - 1;
  }

  get items() {
    return this.layoutItems;
  }

  get scheme() {
    return {
      items: this.items.map((item) => item.scheme),
      groups: this.groups.map((group) => group.scheme),
      strips: this.strips.map((strip) => strip.scheme),
      columns: this.columns.map((column) => column.scheme),
      height: this.height,
      width: this.width,
    };
  }
}
/* eslint-enable prettier/prettier */
