import { utils } from './utils';
import { Item } from './item.js';
import { Group } from './group.js';
import { Strip } from './strip.js';
import { Column } from './column.js';
import layoutsStore from './layoutsStore.js';

export default class Layouter {
  constructor(layoutParams) {
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
    this.styleParams = utils.convertStyleParams(layoutParams.styleParams);
    this.container = utils.convertContainer(
      layoutParams.container,
      this.styleParams,
    );

    const options = layoutParams.options || {};
    this.useExistingLayout = !!options.useExistingLayout;
    this.createLayoutOnInit = options.createLayoutOnInit;
    this.showAllItems = !!options.showAllItems || !!layoutParams.showAllItems;
    this.skipVisibilitiesCalc = !!options.skipVisibilitiesCalc;
    this.useLayoutStore = !!options.useLayoutStore;
  }

  verifyGalleryState() {
    if (!this.container.galleryWidth) {
      this.ready = false;
      this.reason = 'galleryWidth is undefined or 0';
      return false;
    }

    if (!this.styleParams.gallerySize) {
      this.ready = false;
      this.reason = 'gallerySize is undefined or 0';
      return false;
    }

    return true;
  }

  calcNumberOfColumns(galleryWidth, gallerySize) {
    let numOfCols = 1;
    if (this.styleParams.isVertical) {
      if (this.styleParams.fixedColumns > 0) {
        numOfCols = this.styleParams.fixedColumns;
      } else if (this.styleParams.columnWidths) {
        numOfCols = this.styleParams.columnWidths.split(',').length;
      } else {
        numOfCols = Math.ceil(galleryWidth / gallerySize) || 1;
      }
    } else {
      numOfCols = 1;
    }
    return numOfCols;
  }

  findShortestColumn(columns, groupIdx) {
    let minCol = columns[0];
    if (this.styleParams.placeGroupsLtr) {
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
        gallerySize: this.gallerySize,
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
        if (this.styleParams.isVertical) {
          //---------------------| COLUMNS GALLERY |----------------------//
          //remove items from the last 3 groups;
          const lastGroups = this.groups.slice(-3);
          lastGroups.forEach(group => {
            const column = this.columns[group.columnIdx];
            if (column) {
              column.height -= group.totalHeight;
              column.groups.splice(-1, 1);
            }
            this.groups.splice(-1, 1);
            group.items.forEach(() => {
              this.layoutItems.splice(-1, 1);
              this.pointer--;
            });
            this.groupIdx--;
          });
        } else {
          //---------------------| STRIPS GALLERY |----------------------//
          if (this.styleParams.oneRow) {
            //remove items from the last group:
            const lastGroups = this.groups.slice(-1);
            lastGroups.forEach(group => {
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
              group.items.forEach(() => {
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
              lastStrips.forEach(lastStrip => {
                if (lastStrip) {
                  this.strips.splice(-1, 1);
                  const groups = lastStrip.groups;
                  groups.forEach(group => {
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
                0,
              );
              // this.strip = this.strips[this.strips.length - 1];
              this.strip = new Strip({
                idx: this.strips.length,
                container: this.container,
                groupsPerStrip: this.styleParams.groupsPerStrip,
                oneRow: this.styleParams.oneRow,
                gallerySize: this.gallerySize,
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

      if (this.styleParams.forceFullHeight) {
        this.gallerySize = Math.sqrt(
          (this.container.galleryHeight * this.container.galleryWidth) /
            this.srcItems.length,
        );
      } else {
        let gallerySizeVal;
        if (typeof this.styleParams.gallerySize === 'function') {
          gallerySizeVal = this.styleParams.gallerySize();
        } else {
          gallerySizeVal = this.styleParams.gallerySize;
        }
        this.gallerySize =
          Math.floor(gallerySizeVal) +
          Math.ceil(
            2 * (this.styleParams.imageMargin - this.styleParams.galleryMargin),
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
        groupsPerStrip: this.styleParams.groupsPerStrip,
        oneRow: this.styleParams.oneRow,
        gallerySize: this.gallerySize,
      });

      this.galleryHeight = 0;

      this.numOfCols = this.calcNumberOfColumns(
        this.galleryWidth,
        this.gallerySize,
      );
      this.gallerySize = this.styleParams.isVertical
        ? Math.floor(this.galleryWidth / this.numOfCols)
        : this.gallerySize;

      const { columnWidths, cubeRatio } = this.styleParams;

      const columnWidthsArr =
        columnWidths && columnWidths.length > 0
          ? columnWidths.split(',')
          : false;

      let remainderWidth = this.galleryWidth;
      this.columns = Array(this.numOfCols)
        .fill(0)
        .map((column, idx) => {
          //round group widths to fit an even number of pixels
          let colWidth = columnWidthsArr
            ? columnWidthsArr[idx]
            : Math.round(remainderWidth / (this.numOfCols - idx));
          remainderWidth -= colWidth;
          //fix cubeRatio of rounded columns
          const infoWidth = this.styleParams.externalInfoWidth || 0;
          colWidth -= infoWidth;
          // const neededHeight = this.gallerySize / this.styleParams.cubeRatio
          const fixedCubeRatio =
            colWidth /
            ((this.gallerySize - infoWidth) / this.styleParams.cubeRatio);
          //add space for info on the side
          return new Column(idx, colWidth, fixedCubeRatio);
        });
      this.maxLoops = this.srcItems.length * 10;
    }
  }

  createLayout(layoutParams) {
    if (typeof layoutParams !== 'undefined') {
      this.updateParams(layoutParams);
    }

    if (!this.verifyGalleryState()) {
      return false;
    }

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
        gallerySize: this.gallerySize,
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
      if (!this.styleParams.isVertical) {
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
            groupsPerStrip: this.styleParams.groupsPerStrip,
            oneRow: this.styleParams.oneRow,
            gallerySize: this.gallerySize,
          });

          //reset the group (this group will be rebuilt)
          this.pointer -= this.group.realItems.length - 1;
          this.groupIdx--;
          continue;
        }

        //add the group to the (current/new) strip
        this.group.setTop(this.galleryHeight);
        this.strip.ratio += this.group.ratio;
        // this.strip.height = Math.min(gallerySize, (galleryWidth / this.strip.ratio));
        this.strip.height = this.galleryWidth / this.strip.ratio;
        this.strip.setWidth(this.galleryWidth);
        this.strip.addGroup(this.group);

        if (this.isLastImage && this.strip.hasGroups) {
          if (this.styleParams.oneRow) {
            this.strip.height =
              this.container.galleryHeight +
              (this.styleParams.imageMargin - this.styleParams.galleryMargin);
          } else if (this.gallerySize * 1.5 < this.strip.height) {
            //stretching the this.strip to the full width will make it too high - so make it as high as the gallerySize and not stretch
            this.strip.height = this.gallerySize;
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
          this.groups.length - 1,
        );

        //resize the group and images
        this.group.fixItemsRatio(minCol.cubeRatio); //fix last column's items ratio (caused by stretching it to fill the screen)
        this.group.resizeToWidth(minCol.width);
        this.group.round();

        //update the group's position
        this.group.setTop(minCol.height);
        this.group.setLeft(minCol.idx * this.gallerySize);

        //add the image to the column
        minCol.addGroup(this.group);

        //add the image height to the column
        minCol.height += this.group.totalHeight;

        if (this.galleryHeight < minCol.height) {
          this.galleryHeight = minCol.height;
        }
      }

      //set the group visibility

      if (
        !this.skipVisibilitiesCalc &&
        !this.gotScrollEvent &&
        this.pointer < 10
      ) {
        //until the first scroll event, make sure the first 10 groups are displayed
        this.group.calcVisibilities(true);
      } else {
        this.group.calcVisibilities(this.bounds);
      }

      if (!this.firstGroup) {
        this.firstGroup = this.group;
      }

      this.pointer++;
    }

    if (this.styleParams.forceFullHeight) {
      const stretchRatio = this.container.galleryHeight / this.galleryHeight;
      this.items.map(item => {
        item.cubeImages = true;
        item.cubeRatio = item.ratio = item.width / (item.height * stretchRatio);
        item.height *= stretchRatio;
        return item;
      });
      this.groups.map(group => {
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
      (this.styleParams.imageMargin - this.styleParams.galleryMargin) * 2;

    this.width = this.lastGroup.left + this.lastGroup.width;

    if (!this.skipVisibilitiesCalc) {
      this.calcVisibilities(this.bounds);
    }

    this.ready = true;

    return this.scheme;
  }

  calcVisibilities(bounds) {
    for (const column of this.columns) {
      for (const group of column.groups) {
        group.calcVisibilities(bounds);
      }
    }
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
      this.layoutItems.forEach(item => {
        itemY = item.offset.top + item.height / 2;
        itemX = item.offset.left + item.width / 2;
        distance = Math.sqrt(
          Math.pow(itemY - currentItemY, 2) + Math.pow(itemX - currentItemX, 2),
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
          (curX, curY, itmX, itmY) => itmY < curY,
        );
        break;

      case 'left':
        neighborItem = findClosestItem(
          currentItem.offset.left,
          currentItem.offset.top + currentItem.height / 2,
          (curX, curY, itmX) => itmX < curX,
        );
        break;

      case 'down':
        neighborItem = findClosestItem(
          currentItem.offset.left + currentItem.width / 2,
          currentItem.offset.bottom,
          (curX, curY, itmX, itmY) => itmY > curY,
        );
        break;

      default:
      case 'right':
        neighborItem = findClosestItem(
          currentItem.offset.right,
          currentItem.offset.top + currentItem.height / 2,
          (curX, curY, itmX) => itmX > curX,
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
        typeof this.styleParams.groupTypes === 'string' &&
        this.styleParams.groupTypes.length > 0
          ? this.styleParams.groupTypes.split(',')
          : this.styleParams.groupTypes;
      _maxGroupSize = groupTypes.reduce((curSize, groupType) => {
        return Math.max(curSize, parseInt(groupType));
      }, 1);
      _maxGroupSize = Math.min(_maxGroupSize, this.styleParams.groupSize);
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
    if (this.styleParams.layoutsVersion > 1) {
      //layouts version 2+
      return !this.srcItems[this.pointer + 1];
    } else {
      //Backwards compatibility
      return !this.srcItems[this.pointer + 3];
    }
  }

  get imagesLeft() {
    return this.srcItems.length - this.pointer - 1;
  }

  get items() {
    return this.layoutItems;
  }

  get scheme() {
    return {
      items: this.items.map(item => item.scheme),
      groups: this.groups.map(group => group.scheme),
      strips: this.strips.map(strip => strip.scheme),
      columns: this.columns.map(column => column.scheme),
      height: this.height,
      width: this.width,
    };
  }
}
