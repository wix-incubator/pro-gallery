import isUndefined from 'lodash/isUndefined';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import fill from 'lodash/fill';
import sum from 'lodash/sum';
import each from 'lodash/each';

import {utils} from './utils';
import {Item} from './item.js';
import {Group} from './group.js';

class Strip {

  constructor(lastIdx) {
    this.ratio = 0;
    this.groups = [];
    this.height = 0;
    this.idx = (lastIdx || 0) + 1;
  }
}

export default class Layouter {

  constructor(layoutParams) {

    this.ready = false;
    this.pointer = 0;
    this.layoutItems = [];

    this.findNeighborItem = this.findNeighborItem.bind(this);

    this.updateParams(layoutParams);
    this.createLayout();
  }

  insertIfDefined(obj, field, value) {
    if (!isUndefined(value)) {
      obj[field] = value;
    }
  }

  convertStyleParams(styleParams) {

    //default styleParams
    const convertedStyleParams = Object.assign({
      cubeImages: false,
      cubeType: 'fill',
      cubeRatio: 1,
      smartCrop: false,
      imageMargin: 10,
      galleryMargin: 0,
      floatingImages: 0,
      chooseBestGroup: true,
      groupSize: 3,
      groupTypes: '1,2h,2v,3h,3v,3t,3b,3l,3r',
      isVertical: true,
      minItemSize: 120,
      oneRow: false,
      gallerySize: 500,
      collageDensity: 50,
    }, styleParams);

    this.insertIfDefined(convertedStyleParams, 'cubeImages', convertedStyleParams.cropItems);
    this.insertIfDefined(convertedStyleParams, 'cubeType', convertedStyleParams.cropType);
    this.insertIfDefined(convertedStyleParams, 'cubeRatio', convertedStyleParams.cropRatio);
    this.insertIfDefined(convertedStyleParams, 'smartCrop', convertedStyleParams.smartCrop);
    this.insertIfDefined(convertedStyleParams, 'imageMargin', convertedStyleParams.itemSpacing);
    this.insertIfDefined(convertedStyleParams, 'galleryMargin', convertedStyleParams.layoutSpacing);
    this.insertIfDefined(convertedStyleParams, 'floatingImages', convertedStyleParams.randomSpacings);
    this.insertIfDefined(convertedStyleParams, 'chooseBestGroup', convertedStyleParams.smartGrouping);
    this.insertIfDefined(convertedStyleParams, 'groupSize', convertedStyleParams.itemsPerGroup);
    this.insertIfDefined(convertedStyleParams, 'groupTypes', isArray(convertedStyleParams.allowedGroupTypes) ? convertedStyleParams.allowedGroupTypes.join(',') : undefined);
    this.insertIfDefined(convertedStyleParams, 'isVertical', convertedStyleParams.isColumnsLayout);
    this.insertIfDefined(convertedStyleParams, 'minItemSize', convertedStyleParams.minItemSize);
    this.insertIfDefined(convertedStyleParams, 'oneRow', convertedStyleParams.isVerticalScroll);
    this.insertIfDefined(convertedStyleParams, 'gallerySize', convertedStyleParams.rowSize || convertedStyleParams.columnSize);
    this.insertIfDefined(convertedStyleParams, 'collageDensity', convertedStyleParams.collageDensity);

    return convertedStyleParams;
  }

  convertContainer(container, styleParams) {

    const convertedContainer = Object.assign({
      galleryWidth: 1000,
      galleryHeight: 1000,
      bounds: {}
    }, container);

    if (container.width >= 0) {
      convertedContainer.galleryWidth = container.width + ((styleParams.imageMargin || 0) - (styleParams.galleryMargin || 0)) * 2;
    }
    if (container.height >= 0) {
      convertedContainer.galleryHeight = container.height + ((styleParams.imageMargin || 0) - (styleParams.galleryMargin || 0));
    }

    return convertedContainer;
  }

  updateParams(layoutParams) {

    this.srcItems = layoutParams.items;
    this.styleParams = this.convertStyleParams(layoutParams.styleParams);
    this.container = this.convertContainer(layoutParams.container, this.styleParams);
    this.showAllItems = layoutParams.showAllItems;
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

  createLayout(layoutParams) {

    if (!isUndefined(layoutParams)) {
      this.updateParams(layoutParams);
    }

    if (!this.verifyGalleryState()) {
      return false;
    }

    this.pointer = 0;
    this.firstGroup = false;
    this.layoutItems = [];

    let gallerySize = Math.floor(this.styleParams.gallerySize) + Math.ceil(2 * (this.styleParams.imageMargin - this.styleParams.galleryMargin));
    const galleryWidth = Math.floor(this.container.galleryWidth);
    const maxGroupSize = this.maxGroupSize;

    let groupIdx = 1;
    let inStripIdx = 1;
    let item = {};

    let groupItems = [];
    let group;
    const bounds = this.container.bounds || {};

    let strip = new Strip();

    let numOfCols = 1;
    const columns = [];
    const columnsH = [];
    let columnsW = [];
    let cubeRatios = [];

    let galleryHeight = 0;

    let safetyCounter = 1000000;

    if (this.styleParams.isVertical) {
      if (this.styleParams.fixedColumns > 0) {
        numOfCols = utils.isMobile() ? 1 : this.styleParams.fixedColumns;
      } else {
        numOfCols = Math.ceil(galleryWidth / gallerySize) || 1;
      }
      gallerySize = Math.floor(galleryWidth / numOfCols);
      columnsW = fill(Array(numOfCols), gallerySize);
      columnsW[columnsW.length - 1] += (galleryWidth - sum(columnsW)); //the last group compensates for half pixels in other groups
      cubeRatios = fill(Array(numOfCols), this.styleParams.cubeRatio);
      cubeRatios[columnsW.length - 1] = this.styleParams.cubeRatio * (columnsW[columnsW.length - 1] / gallerySize); //fix the last group's cube ratio
    } else {
      numOfCols = 1;
      // gallerySize = Math.min(this.styleParams.gallerySize, galleryWidth);
    }

    while (this.srcItems[this.pointer]) {

      if (isArray(this.srcItems[this.pointer])) {
        console.error({msg: 'no dto', pointer: this.pointer, allItems: this.srcItems});
      }

      //console.log('Creating item #' + this.pointer + ' / ' + this.srcItems.length, this.srcItems[this.pointer]);
      item = new Item({
        idx: this.pointer,
        scrollTop: galleryHeight,
        dto: this.srcItems[this.pointer],
        cubeImages: this.styleParams.cubeImages,
        cubeType: this.styleParams.cubeType,
        cubeRatio: this.styleParams.cubeRatio,
        smartCrop: this.styleParams.smartCrop,
        cropOnlyFill: this.styleParams.cropOnlyFill,
        imageMargin: this.styleParams.imageMargin,
        galleryMargin: this.styleParams.galleryMargin,
        floatingImages: this.styleParams.floatingImages,
        container: this.container,
        createdBy: 'galleryStructure'
      });

      this.layoutItems[this.pointer] = item;

      //push the image to a group - until its full
      groupItems.push(item);
      if ( //conditions to wait for the next item
      !this.isLastImages //last images in gallery - do not group
      &&
      (groupItems.length < maxGroupSize) //if the group is too small
      ) {
        //wait for more images
        this.pointer++;
        continue;
      }

      group = new Group({
        idx: groupIdx,
        stripIdx: strip.idx,
        inStripIdx,
        top: galleryHeight,
        items: groupItems,
        chooseBestGroup: this.styleParams.chooseBestGroup,
        groupTypes: this.styleParams.groupTypes,
        cubeImages: this.styleParams.cubeImages,
        cubeType: this.styleParams.cubeType,
        isVertical: this.styleParams.isVertical,
        minItemSize: this.styleParams.minItemSize,
        gallerySize,
        collageAmount: this.styleParams.collageAmount,
        collageDensity: this.styleParams.collageDensity,
        layoutsVersion: this.styleParams.layoutsVersion,
        bottomInfoHeight: this.styleParams.bottomInfoHeight,
        container: this.container,
        imageMargin: this.styleParams.imageMargin
      });

      groupIdx++;
      inStripIdx++;

      //prepare the images in the group
      //group = this.wrapGroup(groupImages);
      if (group.realItems.length < maxGroupSize) {
        //console.warn(group.items.length, '<' ,maxGroupSize, 'waiting for more');
        //move the cursor back if the resulted group is smaller than 3
        if (safetyCounter > 0) {
          safetyCounter--;
          this.pointer += (group.items.length - groupItems.length);
        } else {
          console.error('safetyCounter Reached!', this);
        }
      }

      groupItems = [];

      //resize and fit the group in the strip / column
      if (!this.styleParams.isVertical) {

        //---------------------| STRIPS GALLERY |----------------------//

        //open a new strip if needed
        let isStripSmallEnough;
        if (this.styleParams.oneRow) {
          isStripSmallEnough = false; //onerow layout is one long strip

        } else {
          const withNewGroup = ((galleryWidth / (strip.ratio + group.ratio)) - gallerySize); //start a new strip BEFORE adding the current group
          const withoutNewGroup = ((galleryWidth / (strip.ratio)) - gallerySize); //start a new strip AFTER adding the current group
          if (isNaN(withNewGroup) || isNaN(withoutNewGroup)) {
            isStripSmallEnough = false;
          } else if (withoutNewGroup < 0) {
            //the strip is already too small
            isStripSmallEnough = true;
          } else if (withNewGroup < 0) {
            //adding the new group makes is small enough
            // check if adding the new group makes the strip TOO small
            //so - without the new group, the strip is larger than the required size - but adding the new group might make it too small
            isStripSmallEnough = (Math.abs(withoutNewGroup) < Math.abs(withNewGroup));

          } else {
            isStripSmallEnough = false;
          }

/*
          if (isStripSmallEnough && this.isLastImage) {
            //if it is the last image - prefer adding it to the last strip rather putting it on a new strip
            isStripSmallEnough = ((Math.abs(withoutNewGroup) * 1) < Math.abs(withNewGroup));
          }
*/
        }

        const shouldStartNewStrip = (
          (!strip.groups) //first image - restart a new strip
          ||
          (
            (strip.groups.length > 0) //strip must have at least one group
            &&
            isStripSmallEnough
          )
        );

        if (shouldStartNewStrip) {
          //close the current strip
          if (strip.groups) {
            strip.groups[strip.groups.length - 1].isLastGroup = true;
            strip.groups[strip.groups.length - 1].stripWidth = galleryWidth;
            this.resizeStrip(strip.groups, (galleryWidth / strip.ratio));
            galleryHeight += (galleryWidth / strip.ratio);
            columns[0] = (columns[0] || []).concat(strip.groups);
          }

          //open a new strip
          strip = new Strip(strip.idx);

          //reset the group (this group will be rebuilt)
          inStripIdx = 1;
          this.pointer -= (group.items.length - 1);
          groupIdx--;
          continue;
        }

        //add the group to the (current/new) strip
        group.setTop(galleryHeight);
        group.stripIdx = strip.idx;
        strip.ratio += group.ratio;
        strip.height = Math.min(gallerySize, (galleryWidth / strip.ratio));
        strip.groups.push(group);

        if (this.isLastImage && strip.groups) {
          if (this.styleParams.oneRow) {
            strip.height = this.container.galleryHeight + (this.styleParams.imageMargin - this.styleParams.galleryMargin);
          } else if (gallerySize * 2 < (galleryWidth / strip.ratio)) {
              //stretching the strip to the full width will make it too high - so make it as high as the gallerySize and not stretch
            strip.height = gallerySize;
          } else {
            strip.height = (galleryWidth / strip.ratio);
          }

          strip.groups[strip.groups.length - 1].isLastGroup = true;
          strip.groups[strip.groups.length - 1].stripWidth = strip.height * strip.ratio;

          this.resizeStrip(strip.groups, strip.height);
          galleryHeight += (strip.height);
          columns[0] = (columns[0] || []).concat(strip.groups);
        }

      } else {

        //---------------------| COLUMNS GALLERY |----------------------//

        //find the shortest column
        let minCol = 0;
        if (this.styleParams.cubeImages) {
          minCol = this.pointer % numOfCols;
          // galleryHeight = Math.max(galleryHeight, columnsH[minCol]);
        } else {
          let minColH = -1;
          for (let i = 0; i < numOfCols; i++) {
            let colH = columnsH[i];
            if (typeof (colH) === 'undefined') {
              colH = 0;
            }
            if (colH < minColH || minColH < 0) {
              minColH = colH;
              minCol = i;
            }
          }
        }

        columns[minCol] = columns[minCol] || [];
        columnsH[minCol] = columnsH[minCol] || 0;

        //resize the group and images
        group.fixItemsRatio(cubeRatios[minCol]); //fix last column's items ratio (caused by stretching it to fill the screen)
        this.resizeGroup(group, columnsW[minCol]);

        //update the group's position
        group.setTop(columnsH[minCol]);
        group.setLeft(minCol * gallerySize);

        //add the image to the column
        columns[minCol].push(group);

        //add the image height to the column
        columnsH[minCol] += group.totalHeight;

        if (galleryHeight < columnsH[minCol]) {
          galleryHeight = columnsH[minCol];
        }

      }

      //set the group visibility

      if (!this.gotScrollEvent && this.pointer < 10) {
        //until the first scroll event, make sure the first 10 groups are displayed
        group.visible = group.rendered = group.required = true;
      } else {
        group = this.calcVisibilitiesForGroup(group, bounds);
      }

      if (!this.firstGroup) {
        this.firstGroup = group;
      }

      //advance the this.pointer
      this.pointer++;
    }

    //results
    this.lastGroup = group;
    this.strips = strip.idx || 0;
    this.columns = columns;
    this.colWidth = Math.floor(galleryWidth / numOfCols);
    this.height = galleryHeight - (this.styleParams.oneRow ? 0 : (this.styleParams.imageMargin - this.styleParams.galleryMargin) * 2);

    this.calcVisibilities(bounds);

    this.ready = true;
  }

  lastVisibleItemIdx() {
    for (let item, i = this.layoutItems.length - 1; item = this.layoutItems[i]; i--) {
      const isVisible = item.offset.top < (this.container.galleryHeight - 100); //the item must be visible and about the show more button
      if (isVisible) {
        return i;
      }
    }
    return this.layoutItems.length - 1;
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
      each(this.layoutItems, item => {
        itemY = item.offset.top + (item.height / 2);
        itemX = item.offset.left + (item.width / 2);
        distance = Math.sqrt(Math.pow(itemY - currentItemY, 2) + Math.pow(itemX - currentItemX, 2));
        if ((minDistance === null || (distance > 0 && distance < minDistance)) && condition(currentItemX, currentItemY, itemX, itemY)) {
          minDistance = distance;
          minDistanceItem = item;
        }
      });
      return minDistanceItem;
    };

    switch (dir) {
      case 'up':
        neighborItem = findClosestItem(
          (currentItem.offset.left + (currentItem.width / 2)),
          (currentItem.offset.top),
          (curX, curY, itmX, itmY) => itmY < curY
        );
        break;

      case 'left':
        neighborItem = findClosestItem(
          (currentItem.offset.left),
          (currentItem.offset.top + (currentItem.height / 2)),
          (curX, curY, itmX, itmY) => itmX < curX
        );
        break;

      case 'down':
        neighborItem = findClosestItem(
          (currentItem.offset.left + (currentItem.width / 2)),
          (currentItem.offset.bottom),
          (curX, curY, itmX, itmY) => itmY > curY
        );
        break;

      default:
      case 'right':
        neighborItem = findClosestItem(
          (currentItem.offset.right),
          (currentItem.offset.top + (currentItem.height / 2)),
          (curX, curY, itmX, itmY) => itmX > curX
        );
        break;

    }

    if (neighborItem.idx >= 0) {
      if (utils.isDev()) {
        console.log('found neighborItem #' + neighborItem.idx, neighborItem);
      }
      return neighborItem.idx;
    } else {
      console.warn('Could not find offset for itemIdx', itemIdx, dir);
      return itemIdx; //stay on the same item
    }

  }

  calcVisibilities(bounds) {
    if (utils.shouldLog('visibilities')) {
      console.log('Calculating Visibilities for groups', bounds, this.columns);
    }
    for (let column, c = 0; column = this.columns[c]; c++) {
      for (let group, g = 0; group = column[g]; g++) {
        column[g] = this.calcVisibilitiesForGroup(group, bounds);
        if (utils.shouldLog('visibilities')) {
          console.log('Calculating Visibilities - group #' + column[g].idx + ' is ' + (column[g].visible ? 'VISIBLE' : (column[g].rendered ? 'RENDERED' : 'HIDDEN')), column[g], bounds);
        }
      }
    }
  }

  calcVisibilitiesForGroup(group, bounds) {
    if (this.showAllItems === true) {
      group.onscreen = group.visible = group.rendered = group.required = true;
    } else if (this.styleParams.oneRow) {
      group.onscreen = group.right >= bounds.onscreenTop && group.left <= bounds.onscreenBottom;
      group.visible = group.right >= bounds.visibleTop && group.left <= bounds.visibleBottom;
      group.rendered = group.right >= bounds.renderedTop && group.left <= bounds.renderedBottom;
      group.required = group.right >= bounds.requiredTop && group.left <= bounds.requiredBottom;
    } else {
      group.onscreen = group.bottom >= bounds.onscreenTop && group.top <= bounds.onscreenBottom;
      group.visible = group.bottom >= bounds.visibleTop && group.top <= bounds.visibleBottom;
      group.rendered = group.bottom >= bounds.renderedTop && group.top <= bounds.renderedBottom;
      group.required = group.bottom >= bounds.requiredTop && group.top <= bounds.requiredBottom;
    }
    for (let i = 0; i < group.items.length; i++) {
      group.items[i].visibility = {
        onscreen: group.onscreen,
        visible: group.visible,
        rendered: group.rendered,
        required: group.required
      };
    }
    return group;
  }

  resizeStrip(groups, height) {
    let left = 0;
    let remainder = 0;
    for (let group, g = 0; group = groups[g]; g++) {
      group.setLeft(left);
      // group.left = (left);
      group.width += remainder; //add the remainder from the last group round
      group.resizeToHeight(height);
      remainder = group.width;
      group.round();
      remainder -= group.width;
      left += group.width;
    }
  }

  resizeGroup(group, width) {
    group.resizeToWidth(width);
    group.round();
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

  get maxGroupSize() {
    let _maxGroupSize = 1;
    try {
      const groupTypes = isString(this.styleParams.groupTypes) ? this.styleParams.groupTypes.split(',') : this.styleParams.groupTypes;
      _maxGroupSize = groupTypes.reduce((curSize, groupType) => {
        return Math.max(curSize, parseInt(groupType));
      }, 1);
      _maxGroupSize = Math.min(_maxGroupSize, this.styleParams.groupSize);
    } catch (e) {
      console.error('couldn\'t calculate max group size - returing 3 (?)', e);
      _maxGroupSize = 3;
    }
    return _maxGroupSize;
  }

  get items() {
    return this.layoutItems;
  }
}
