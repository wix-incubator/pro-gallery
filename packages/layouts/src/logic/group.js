import { Item } from './item.js';

const GROUP_TYPES_BY_RATIOS_V = {
  lll: '1,2h',
  llp: '1,3r',
  lpl: '1,2h',
  pll: '1,2h,3l',
  lpp: '1,2h,3r,3h',
  plp: '1,2h,3l,3r,3h',
  ppl: '1,2h,3l,3h',
  ppp: '1,2h,3l,3r,3h',
};

const GROUP_TYPES_BY_RATIOS_H = {
  lll: '1,2v,3t,3b,3v',
  llp: '1,2v,3t,3v',
  lpl: '1,2v,3t,3b,3v',
  pll: '1,2v,3b,3v',
  lpp: '1,2v,3t',
  plp: '1,2v',
  ppl: '1,3b',
  ppp: '1,2h',
};

const GROUP_SIZES_BY_MAX_SIZE = {
  1: [[1]],
  2: [[1], [1, 2], [2]],
  3: [[1], [1, 2], [1, 2, 3], [2, 3], [3]],
};

export class Group {
  constructor(config) {
    this.idx = config.idx;
    this.stripIdx = config.stripIdx;
    this.inStripIdx = config.inStripIdx;
    this.top = config.top;
    this.showAllItems = config.showAllItems;
    this.isLastItems = config.isLastItems;
    this.dummyItems = [];
    this.targetItemSize = config.targetItemSize;

    this.items = config.items.map((item) => {
      item.Group = this;
      return item;
    });

    if (config.styleParams) {
      const { styleParams } = config;
      this.oneRow = styleParams.oneRow;
      this.cubeType = styleParams.cubeType;
      this.cubeImages = styleParams.cubeImages;
      this.isVertical = styleParams.isVertical;
      this.minItemSize = styleParams.minItemSize;
      this.collageAmount = styleParams.collageAmount;
      this.collageDensity = styleParams.collageDensity;
      this.groupTypes = String(styleParams.groupTypes);
      this.rotatingGroupTypes = String(styleParams.rotatingGroupTypes);
      this.rotatingCropRatios = String(styleParams.rotatingCropRatios);
      this.chooseBestGroup = styleParams.chooseBestGroup;
      this.layoutsVersion = styleParams.layoutsVersion;
      this.externalInfoHeight = styleParams.externalInfoHeight;
      this.externalInfoWidth = styleParams.externalInfoWidth;
      this.imageMargin = styleParams.imageMargin;
      this.groupSize = styleParams.groupSize;
    }

    this.visible = true;
    this.rendered = true;
    this.required = true;

    //prepare the group
    let forcedGroupSize = this.items.length;

    //todo - check if minItem size is really working
    while (!this.isWithinMinItemSize && forcedGroupSize > 0) {
      this.placeItems(forcedGroupSize);
      this.resize();
      forcedGroupSize--;
    }
  }

  resize() {
    if (this.isVertical) {
      this.resizeToWidth(this.targetItemSize);
    } else {
      this.resizeToHeight(this.targetItemSize);
    }
    this.setLeft(this.left);
    this.setTop(this.top);
  }

  safeGetItem(idx) {
    if (this.items[idx]) {
      return this.items[idx];
    } else if (this.dummyItems[idx]) {
      return this.dummyItems[idx];
    } else {
      // dummy created from the last item config
      const item = new Item({ ...this.items[this.items.length - 1].config });

      // const item = {...(this.items[this.items.length - 1])};
      // item.id += 'dummy';

      // item.idx given to dummy items starting from the last item
      // item.config.idx = last item index (all gallery items, not group items)
      // idx = in group item index
      // this.items = the group's items
      item.idx = item.config.idx + idx - (this.items.length - 1);
      item.type = 'dummy';
      this.dummyItems[idx] = item;
      return item;
    }
  }

  setCubedHeight(height) {
    const shouldUseFixedHeight =
      this.cubeImages &&
      this.groupSize === 1 &&
      ['fill', 'fit'].includes(this.cubeType) &&
      this.rotatingGroupTypes.length === 0 &&
      this.rotatingCropRatios.length === 0;
    this.cubedHeight = shouldUseFixedHeight ? height : null;
  }

  round() {
    //round all sizes to full pixels

    if (this.isLastGroup && !this.oneRow) {
      this.width = this.stripWidth - this.left;
    } else {
      this.width = Math.round(this.width);
    }
    this.height = Math.round(this.height);

    for (const item of this.items) {
      item.width = Math.round(item.width);
      item.height = Math.round(item.height);
      item.group = {
        width: this.width,
        height: this.height,
      };
    }
    const m = this.imageMargin;

    switch (this.type) {
      default:
      case '1':
        this.safeGetItem(0).width = this.width - m;
        this.safeGetItem(0).height = this.height - m;
        break;
      case '2v':
        this.safeGetItem(0).width = this.safeGetItem(1).width = this.width - m;
        this.safeGetItem(0).height =
          this.height - this.safeGetItem(1).height - 2 * m;
        break;
      case '2h':
        this.safeGetItem(0).height = this.safeGetItem(1).height =
          this.height - m;
        this.safeGetItem(0).width =
          this.width - this.safeGetItem(1).width - 2 * m;
        break;
      case '3t':
        this.safeGetItem(0).width = this.width - m;
        this.safeGetItem(0).height =
          this.height - this.safeGetItem(1).height - 2 * m;
        this.safeGetItem(1).width =
          this.width - this.safeGetItem(2).width - 2 * m;
        this.safeGetItem(2).height = this.safeGetItem(1).height;
        break;
      case '3b':
        this.safeGetItem(0).width =
          this.width - this.safeGetItem(1).width - 2 * m;
        this.safeGetItem(1).height = this.safeGetItem(0).height;
        this.safeGetItem(2).height =
          this.height - this.safeGetItem(1).height - 2 * m;
        this.safeGetItem(2).width = this.width - m;
        break;
      case '3l':
        this.safeGetItem(1).height =
          this.height - this.safeGetItem(2).height - 2 * m;
        this.safeGetItem(2).width = this.safeGetItem(1).width;
        this.safeGetItem(0).width =
          this.width - this.safeGetItem(1).width - 2 * m;
        this.safeGetItem(0).height = this.height - m;
        break;
      case '3r':
        this.safeGetItem(0).height =
          this.height - this.safeGetItem(1).height - 2 * m;
        this.safeGetItem(1).width = this.safeGetItem(0).width;
        this.safeGetItem(2).width =
          this.width - this.safeGetItem(1).width - 2 * m;
        this.safeGetItem(2).height = this.height - m;
        break;
      case '3v':
        this.safeGetItem(0).width = this.width - m;
        this.safeGetItem(1).width = this.width - m;
        this.safeGetItem(2).width = this.width - m;
        this.safeGetItem(2).height =
          this.height -
          this.safeGetItem(0).height -
          this.safeGetItem(1).height -
          3 * m;
        break;
      case '3h':
        this.safeGetItem(0).height = this.height - m;
        this.safeGetItem(1).height = this.height - m;
        this.safeGetItem(2).height = this.height - m;
        this.safeGetItem(2).width =
          this.width -
          this.safeGetItem(0).width -
          this.safeGetItem(1).width -
          3 * m;
        break;
    }
  }

  getGroupType(forcedGroupSize) {
    //---------| Override with specifically defined rotating group types (ignores everything else)
    if (this.rotatingGroupTypes) {
      const groupTypesArr = String(this.rotatingGroupTypes).split(',');
      return groupTypesArr[this.idx % groupTypesArr.length];

      // } else if (this.isLastItems) {
      //   return this.groupTypes.split(',')[0] || '1';
    } else {
      //isVertical - is the gallery vertical (pinterest style) or horizontal (flickr style)

      //---------| Find the best groupType for each ratios case
      //optional types:
      //  1   => single photo
      //  2v  => 2 photos one above the other
      //  2h  => 2 photos one alongside the other
      //  3b  => 3 photos - one large at the bottom and two small on top, one alongside the other
      //  3t  => 3 photos - one large on top and two small at the bottom, one alongside the other
      //  3l  => 3 photos - one large on the left and two small on the right, one above the other
      //  3r  => 3 photos - one large on the right and two small on the left, one above the other

      //define optional ratios for each type:
      //  1   => all
      //  2v  => lll,llp,ppp     (horizontal only)
      //  2h  => ppp,ppl,lll     (vertical only)
      //  3b  => lll,lpl,pll,ppl (horizontal only)
      //  3t  => lll,lpl,llp,lpp (horizontal only)
      //  3l  => ppp,plp,ppl,pll (vertical only)
      //  3r  => ppp,plp,lpp,llp (vertical only)

      const isV = this.isVertical;
      let optionalTypes; //optional groupTypes (separated by ,). 1 is always optional

      if (this.chooseBestGroup) {
        //map the group to l=landscape and p=portrait
        //create a string to state the images group's type
        const ratios = this.items
          .map((item) => item.orientation.slice(0, 1))
          .join('');
        optionalTypes = (isV
          ? GROUP_TYPES_BY_RATIOS_V
          : GROUP_TYPES_BY_RATIOS_H)[ratios];
      } else if (this.items.length === 3 || forcedGroupSize === 3) {
        optionalTypes = isV ? '1,2h,3l,3r,3h' : '1,2v,3t,3b,3v';
      }

      if (this.items.length === 2 || forcedGroupSize === 2) {
        optionalTypes = isV ? '1,2h' : '1,2v';
      }
      if (this.items.length === 1 || forcedGroupSize === 1) {
        optionalTypes = '1';
      }

      let groupTypes = optionalTypes.length > 0 ? optionalTypes.split(',') : [];

      //---------| Override with specifically defined group types
      if (this.groupTypes) {
        // let groupTypesArr = union(['1'], this.groupTypes.split(','));
        const groupTypesArr = this.groupTypes.split(',');

        if (groupTypesArr.length > 1) {
          groupTypes = groupTypes.filter(
            (gt) => groupTypesArr.indexOf(gt) >= 0
          );

          if (groupTypes.length === 0) {
            //there is no match between required group types and the optional ones - use
            groupTypes = ['1'];
          }
        } else {
          groupTypes = groupTypesArr;
        }
      }

      //---------| Calc collage density
      if (this.layoutsVersion > 1 && this.collageDensity >= 0) {
        //th new calculation of the collage amount

        const collageDensity = this.collageDensity;

        //use the collage amount to determine the optional groupsize
        const maxGroupType = parseInt(groupTypes[groupTypes.length - 1]);
        const optionalGroupSizes = GROUP_SIZES_BY_MAX_SIZE[maxGroupType];
        const targetGroupSizes =
          optionalGroupSizes[
            Math.floor(collageDensity * (optionalGroupSizes.length - 1))
          ];
        // seed += ((collageDensity * 1.5) - 0.75) * numOfOptions;

        groupTypes = groupTypes.filter(
          (groupType) => targetGroupSizes.indexOf(parseInt(groupType)) >= 0
        );

        if (groupTypes.length === 0) {
          groupTypes = ['1'];
        }
      }

      const seed = this.calculateRandomSeed(groupTypes.length);

      //---------| Final group type to render according to:
      // - the number of options
      // - the collageAmount (if 0 - always renders 1 image, if 1 always renders the max amount)
      // - random seed (determined by the hash)
      return groupTypes[seed] || '1';
    }
  }

  calculateRandomSeed(numOfOptions) {
    let seed;
    if (this.isVertical) {
      //vertical galleries random is not relevant (previous group is in another column)
      seed = this.items[0].seed % numOfOptions;
    } else {
      seed = (this.inStripIdx + this.stripIdx) % numOfOptions;
    }

    if (this.layoutsVersion === 1 && this.collageAmount >= 0) {
      //backwards compatibility
      seed += (this.collageAmount - 0.5) * numOfOptions;
    }

    return Math.round(Math.min(Math.max(0, seed), numOfOptions - 1));
  }

  placeItems(forcedGroupSize) {
    this.type = this.getGroupType(forcedGroupSize);

    //---------| Render the images by the groupType
    let items = [];
    let item;
    let w = 0;
    let h = 0;

    switch (this.type) {
      default:
      case '1':
        item = this.safeGetItem(0);
        item.pinToCorner('top-left');
        items.push(item);
        w = item.width;
        h = item.height;

        break;

      case '2v':
        item = this.safeGetItem(0);
        item.pinToCorner('top-left');
        items.push(item);
        w = item.width;
        h = item.height;

        item = this.safeGetItem(1);
        item.pinToCorner('bottom-left');
        item.resize(w / item.width);
        h += item.height;
        items.push(item);

        break;

      case '2h':
        item = this.safeGetItem(0);
        item.pinToCorner('top-left');
        item.innerOffset = [0, 0];
        items.push(item);
        w = item.width;
        h = item.height;

        item = this.safeGetItem(1);
        item.pinToCorner('top-right');
        item.innerOffset = [0, 0];
        item.resize(h / item.height);
        w += item.width;
        items.push(item);

        break;

      case '3b':
        item = this.safeGetItem(0);
        item.pinToCorner('top-left');
        items.push(item);
        w = item.width;
        h = item.height;

        item = this.safeGetItem(1);
        item.pinToCorner('top-right');
        item.resize(h / item.height);
        w += item.width;
        items.push(item);

        item = this.safeGetItem(2);
        item.pinToCorner('bottom-left');
        item.resize(w / item.width);
        h += item.height;
        items.push(item);

        break;

      case '3t':
        item = this.safeGetItem(1);
        item.pinToCorner('bottom-left');
        items.push(item);
        w = item.width;
        h = item.height;

        item = this.safeGetItem(2);
        item.pinToCorner('bottom-right');
        item.resize(h / item.height);
        w += item.width;
        items.push(item);

        item = this.safeGetItem(0);
        item.pinToCorner('top-left');
        item.resize(w / item.width);
        h += item.height;
        items = [item].concat(items);

        break;

      case '3r':
        item = this.safeGetItem(0);
        item.pinToCorner('top-left');
        items.push(item);
        w = item.width;
        h = item.height;

        item = this.safeGetItem(1);
        item.pinToCorner('bottom-left');
        item.resize(w / item.width);
        h += item.height;
        items.push(item);

        item = this.safeGetItem(2);
        item.pinToCorner('top-right');
        item.resize(h / item.height);
        w += item.width;
        items.push(item);

        break;

      case '3l':
        item = this.safeGetItem(1);
        item.pinToCorner('top-right');
        items.push(item);
        w = item.width;
        h = item.height;

        item = this.safeGetItem(2);
        item.pinToCorner('bottom-right');
        item.resize(w / item.width);
        h += item.height;
        items.push(item);

        item = this.safeGetItem(0);
        item.pinToCorner('top-left');
        item.resize(h / item.height);
        w += item.width;
        items = [item].concat(items);

        break;

      case '3v':
        item = this.safeGetItem(0);
        item.pinToCorner('top-left');
        item.setPosition('relative');
        items.push(item);
        w = item.width;
        h = item.height;

        item = this.safeGetItem(2);
        item.pinToCorner('bottom-left');
        item.setPosition('relative');
        item.resize(w / item.width);
        h += item.height;
        items.push(item);

        //the middle item must be last to position it in the middle (h must be full height)
        item = this.safeGetItem(1);
        item.setPosition('relative');
        item.resize(w / item.width);
        h += item.height;
        item.pinToCorner('top', items[0]);
        items = [items[0], item, items[1]];

        break;

      case '3h':
        item = this.safeGetItem(0);
        item.pinToCorner('top-left');
        item.setPosition('relative');
        items.push(item);
        w = item.width;
        h = item.height;

        item = this.safeGetItem(2);
        item.pinToCorner('top-right');
        item.setPosition('relative');
        item.resize(h / item.height);
        w += item.width;
        items.push(item);

        //the middle item must be last to position it in the middle (w must be full width)
        item = this.safeGetItem(1);
        item.setPosition('relative');
        item.resize(h / item.height);
        w += item.width;
        item.pinToCorner('left', items[0]);
        items = [items[0], item, items[1]];

        break;
    }

    this.width = w;
    this.height = h;
    this.items = items;
    this.placed = true;
  }

  resizeToHeight(height) {
    this.height = height;
    this.width = this.getWidthByHeight(height);
    this.resizeItems();
  }

  resizeToWidth(width) {
    this.width = width;
    this.height = this.getHeightByWidth(width);

    this.resizeItems();
  }

  resizeItems() {
    const items =
      ['3b', '3r'].indexOf(this.type) >= 0
        ? this.items.slice().reverse()
        : this.items;
    items.forEach((item, i) => {
      item.resize(this.getItemDimensions(items, i));
      item.group = {
        top: this.top,
        left: this.left,
        width: this.width,
        height: this.height,
      };
      item.groupOffset = {
        bottom: this.top + this.height,
        right: this.left + this.width,
      };
    });
  }

  getItemDimensions(items, idx) {
    const m = this.imageMargin;
    switch (this.type) {
      default:
      case '1':
      case '2v':
      case '3v': {
        const w = this.width - m;
        return {
          width: w,
        };
      }
      case '2h':
      case '3h': {
        const h = this.height - m;
        return {
          height: h,
        };
      }
      case '3t':
      case '3b':
        if (idx === 0) {
          const w = this.width - m;
          return {
            width: w,
          };
        } else {
          const h = this.height - items[0].height - 2 * m;
          return {
            height: h,
          };
        }
      case '3r':
      case '3l':
        if (idx === 0) {
          const h = this.height - m;
          return {
            height: h,
          };
        } else {
          const w = this.width - items[0].width - 2 * m;
          return {
            width: w,
          };
        }
    }
  }

  getHeightByWidth(W) {
    let Rg = 1;
    let Rm = 1;
    const M = this.imageMargin;
    const R = this.items.map((item) => item.width / item.height);
    switch (this.type) {
      // ---------------------------------
      // GENERAL FORMULA:
      // ---------------------------------
      // Rg = Group ratio [layout specific calculation]
      // M = margin space between items ( = margin around item * 2)
      // Rm = Margin ratio [layout specific calculation]
      // ---------------------------------
      // | H = W * R + M * Rm |
      // ---------------------------------
      //    const H = W * Rg + M * (Vi - Hi * Rg);

      default:
      case '1':
        Rg = 1 / R[0];
        Rm = 1 - Rg;
        break;
      case '2h':
        Rg = 1 / (R[0] + R[1]);
        Rm = 1 - 2 * Rg;
        break;
      case '2v':
        Rg = 1 / R[0] + 1 / R[1];
        Rm = 2 - Rg;
        break;
      case '3h':
        Rg = 1 / (R[0] + R[1] + R[2]);
        Rm = 1 - 3 * Rg;
        break;
      case '3v':
        Rg = 1 / R[0] + 1 / R[1] + 1 / R[2];
        Rm = 3 - Rg;
        break;
      case '3t':
        Rg = 1 / (R[2] + R[1]) + 1 / R[0];
        Rm = 2 - 2 / (R[2] + R[1]) + 1 / R[0];
        break;
      case '3b':
        Rg = 1 / (R[0] + R[1]) + 1 / R[2];
        Rm = 2 - 2 / (R[0] + R[1]) + 1 / R[2];
        break;
      case '3l':
        Rg = (R[1] + R[2]) / (R[0] * R[1] + R[1] * R[2] + R[0] * R[2]);
        Rm = 2 - Rg * (2 + R[0]);
        break;
      case '3r':
        Rg = (R[0] + R[1]) / (R[0] * R[1] + R[1] * R[2] + R[0] * R[2]);
        Rm = 2 - Rg * (2 + R[2]);
        break;
    }
    const H = W * Rg + M * Rm;

    return H;
  }

  getWidthByHeight(H) {
    let Rg = 1;
    let Rm = 1;
    const M = this.imageMargin;
    const R = this.items.map((item) => item.width / item.height);
    switch (this.type) {
      // ---------------------------------
      // GENERAL FORMULA:
      // ---------------------------------
      // Rh = Group ratio [layout specific calculation]
      // M = margin space between items ( = margin around item * 2)
      // Rm = Margin ratio [layout specific calculation]
      // ---------------------------------
      // | W = H * Rg + M * Rm |
      // ---------------------------------
      default:
      case '1':
        Rg = R[0];
        Rm = 1 - Rg;
        break;
      case '2h':
        Rg = R[0] + R[1];
        Rm = 2 - Rg;
        break;
      case '2v':
        Rg = 1 / (1 / R[0] + 1 / R[1]);
        Rm = 1 - 2 * Rg;
        break;
      case '3h':
        Rg = R[0] + R[1] + R[2];
        Rm = 3 - Rg;
        break;
      case '3v':
        Rg = 1 / (1 / R[0] + 1 / R[1] + 1 / R[2]);
        Rm = 1 - 3 * Rg;
        break;
      case '3t':
        Rg = 1 / (1 / (R[2] + R[1]) + 1 / R[0]);
        Rm = (2 / (R[2] + R[1]) + 1 / R[0] - 2) * Rg;
        break;
      case '3b':
        Rg = 1 / (1 / (R[0] + R[1]) + 1 / R[2]);
        Rm = (2 / (R[0] + R[1]) + 1 / R[2] - 2) * Rg;
        break;
      case '3l':
        Rg = (R[0] * R[1] + R[1] * R[2] + R[0] * R[2]) / (R[1] + R[2]);
        Rm = 2 + R[0] - 2 * Rg;
        break;
      case '3r':
        Rg = (R[0] * R[1] + R[1] * R[2] + R[0] * R[2]) / (R[0] + R[1]);
        Rm = 2 + R[2] - 2 * Rg;
        break;
    }
    const W = H * Rg + M * Rm;

    return W;
  }

  setTop(top) {
    this.top = top || 0;
    for (const item of this.items) {
      item.groupOffset = {
        top,
        bottom: top + this.height,
      };
    }
  }

  setLeft(left) {
    this.left = left || 0;
    for (const item of this.items) {
      item.groupOffset = {
        left,
        right: left + this.width,
      };
    }
  }

  get id() {
    return 'g' + this.idx + '_' + (this.items[0] || {}).id;
  }

  get ratio() {
    const w = this.width;
    const h = this.height;
    return w / h;
  }

  get height() {
    return this.cubedHeight || this._height;
  }

  set height(h) {
    this._height = h;
  }

  get totalHeight() {
    return this.height + this.infoHeight;
  }

  get infoHeight() {
    return this.externalInfoHeight || 0;
  }

  get infoWidth() {
    return this.Column ? this.Column.infoWidth : this.externalInfoWidth || 0;
  }

  get bottom() {
    return this.top + this.height;
  }

  get right() {
    return this.left + this.width;
  }

  set items(items) {
    this._items = items;
  }

  get items() {
    return this._items;
  }

  get realItems() {
    return this._items.filter((item) => item.type !== 'dummy');
  }

  get isWithinMinItemSize() {
    if (this.items.length === 0 || !this.placed) {
      return false;
    }
    if (this.items.length === 1) {
      return true;
    } else {
      return this.items.reduce((i, item) => {
        const isInSize = Math.min(item.width, item.height) >= this.minItemSize;
        return i && isInSize;
      }, true);
    }
  }

  get scheme() {
    return {
      id: this.id,
      idx: this.idx,
      stripIdx: this.stripIdx,
      inStripIdx: this.inStripIdx,
      isLastGroup: this.isLastGroup,
      items: this.items.map((item) => item.scheme),
      type: this.type,
      width: this.width,
      height: this.height,
      infoHeight: this.infoHeight,
      infoWidth: this.infoWidth,
      ratio: this.ratio,
      top: this.top,
      left: this.left,
      right: this.right,
      bottom: this.bottom,
      visible: this.visible,
      rendered: this.rendered,
      required: this.required,
    };
  }
}
