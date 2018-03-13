import cloneDeep from 'lodash/cloneDeep';
import last from 'lodash/last';
import remove from 'lodash/remove';
import includes from 'lodash/includes';
import filter from 'lodash/filter';
import {utils} from './utils';

export class Group {

  constructor(config) {
    this.idx = config.idx;
    this.stripIdx = config.stripIdx;
    this.inStripIdx = config.inStripIdx;
    this.items = config.items;
    this.cubeImages = config.cubeImages;
    this.cubeType = config.cubeType;
    this.top = config.top;
    this.isVertical = config.isVertical;
    this.minItemSize = config.minItemSize;
    this.gallerySize = config.gallerySize;
    this.collageAmount = config.collageAmount;
    this.collageDensity = config.collageDensity;
    this.groupTypes = config.groupTypes;
    this.rotatingGroupTypes = config.rotatingGroupTypes;
    this.chooseBestGroup = config.chooseBestGroup;
    this.layoutsVersion = config.layoutsVersion;
    this.bottomInfoHeight = config.bottomInfoHeight;
    this.imageMargin = config.imageMargin;

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
      this.resizeToWidth(this.gallerySize);
    } else {
      this.resizeToHeight(this.gallerySize);
    }
  }

  safeGetItem(idx) {
    if (this.items[idx]) {
      return this.items[idx];
    } else {
      const item = cloneDeep(last(this.items));
      item.id += 'dummy';
      item.idx = this.idx * (idx + 1) + 1;
      item.type = 'dummy';
      return item;
    }
  }

  fixItemsRatio(ratio) {

    for (let item, i = 0; item = this.items[i]; i++) {
      item.cubeRatio = ratio;
      item.resize(1);
    }
  }

  round() {

    //round all sizes to full pixels

    if (this.isLastGroup) {
      this.width = this.stripWidth - this.left;
    } else {
      this.width = Math.round(this.width);
    }
    this.height = Math.round(this.height);

    for (let item, i = 0; item = this.items[i]; i++) {
      item.width = Math.round(item.width);
      item.height = Math.round(item.height);
      item.group = {
        width: this.width,
        height: this.height
      };
    }

    // return;

    const m = this.imageMargin * 2;

    if (utils.shouldLog('spacing')) {
      console.log('SPACING - before rounding group #' + this.idx, this.realItems.map(i => `[${i.width}/${i.height}]`).join(', '));
    }

    switch (this.type) {
      default:
      case '1':
        this.safeGetItem(0).width = this.width - m;
        this.safeGetItem(0).height = this.height - m;
        break;
      case '2v':
        this.safeGetItem(0).width = this.safeGetItem(1).width = this.width - m;
        this.safeGetItem(0).height = this.height - this.safeGetItem(1).height - 2 * m;
        break;
      case '2h':
        this.safeGetItem(0).height = this.safeGetItem(1).height = this.height - m;
        this.safeGetItem(0).width = this.width - this.safeGetItem(1).width - 2 * m;
        break;
      case '3t':
        this.safeGetItem(0).width = this.width - m;
        this.safeGetItem(0).height = this.height - this.safeGetItem(1).height - 2 * m;
        this.safeGetItem(1).width = this.width - this.safeGetItem(2).width - 2 * m;
        this.safeGetItem(2).height = this.safeGetItem(1).height;
        break;
      case '3b':
        this.safeGetItem(0).width = this.width - this.safeGetItem(1).width - 2 * m;
        this.safeGetItem(1).height = this.safeGetItem(0).height;
        this.safeGetItem(2).height = this.height - this.safeGetItem(1).height - 2 * m;
        this.safeGetItem(2).width = this.width - m;
        break;
      case '3l':
        this.safeGetItem(1).height = this.height - this.safeGetItem(2).height - 2 * m;
        this.safeGetItem(2).width = this.safeGetItem(1).width;
        this.safeGetItem(0).width = this.width - this.safeGetItem(1).width - 2 * m;
        this.safeGetItem(0).height = this.height - m;
        break;
      case '3r':
        this.safeGetItem(0).height = this.height - this.safeGetItem(1).height - 2 * m;
        this.safeGetItem(1).width = this.safeGetItem(0).width;
        this.safeGetItem(2).width = this.width - this.safeGetItem(1).width - 2 * m;
        this.safeGetItem(2).height = this.height - m;
        break;
      case '3v':
        this.safeGetItem(0).width = this.width - m;
        this.safeGetItem(1).width = this.width - m;
        this.safeGetItem(2).width = this.width - m;
        this.safeGetItem(2).height = this.height - this.safeGetItem(0).height - this.safeGetItem(1).height - 3 * m;
        break;
      case '3h':
        this.safeGetItem(0).height = this.height - m;
        this.safeGetItem(1).height = this.height - m;
        this.safeGetItem(2).height = this.height - m;
        this.safeGetItem(2).width = this.width - this.safeGetItem(0).width - this.safeGetItem(1).width - 3 * m;
        break;
    }

    if (utils.shouldLog('spacing')) {
      console.log('SPACING - after rounding group #' + this.idx, this.realItems.map(i => `[${i.width}/${i.height}]`).join(', '));
    }

  }

  placeItems(forcedGroupSize) {

    //isVertical - is the gallery vertical (pinterest style) or horizontal (flickr style)

    //map the group to l=landscape and p=portrait
    //create a string to state the images group's type
    this.ratios = this.items.map(item => {
      return item.orientation.slice(0, 1);
    }).join('');

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
      switch (this.ratios) {
        case 'lll':
          optionalTypes = (isV ? '1,2h' : '1,2v,3t,3b,3v');
          break;
        case 'llp':
          optionalTypes = (isV ? '1,3r' : '1,2v,3t,3v');
          break;
        case 'lpl':
          optionalTypes = (isV ? '1,2h' : '1,2v,3t,3b,3v');
          break;
        case 'pll':
          optionalTypes = (isV ? '1,2h,3l' : '1,2v,3b,3v');
          break;

        case 'lpp':
          optionalTypes = (isV ? '1,2h,3r,3h' : '1,2v,3t');
          break;
        case 'plp':
          optionalTypes = (isV ? '1,2h,3l,3r,3h' : '1,2v');
          break;
        case 'ppl':
          optionalTypes = (isV ? '1,2h,3l,3h' : '1,3b');
          break;
        default:
        case 'ppp':
          optionalTypes = (isV ? '1,2h,3l,3r,3h' : '1,2h');
          break;
      }

    } else if (this.items.length === 3 || forcedGroupSize === 3) {
      optionalTypes = (isV ? '1,2h,3l,3r,3h' : '1,2v,3t,3b,3v');
    }

    if (this.items.length === 2 || forcedGroupSize === 2) {
      optionalTypes = (isV ? '1,2h' : '1,2v');
    }
    if (this.items.length === 1 || forcedGroupSize === 1) {
      optionalTypes = '1';
    }

    let groupTypes = optionalTypes.length > 0 ? optionalTypes.split(',') : [];

    //---------| Override with specifically defined rotating group types (ignores everything else)
    if (this.rotatingGroupTypes) {
      const groupTypesArr = this.rotatingGroupTypes.split(',');
      this.type = groupTypesArr[(this.idx - 1) % groupTypesArr.length];

    //---------| Override with specifically defined group types
    } else {
      if (this.groupTypes) {

        // let groupTypesArr = union(['1'], this.groupTypes.split(','));
        const groupTypesArr = this.groupTypes.split(',');

        if (groupTypesArr.length > 1) {
          remove(groupTypes, gt => groupTypesArr.indexOf(gt) < 0);

          if (groupTypes.length === 0) { //there is no match between required group types and the optional ones - use
            groupTypes = ['1'];
          }
        } else {
          groupTypes = groupTypesArr;
        }

      }


      //---------| Calc collage density
      if (this.layoutsVersion > 1 && this.collageDensity) {
        //th new calculation of the collage amount

        const collageDensity = this.collageDensity;

        //use the collage amount to determine the optional groupsize
        const maxGroupType = parseInt(last(groupTypes));
        let optionalGroupSizes;
        if (maxGroupType === 3) {
          optionalGroupSizes = [[1], [1, 2], [1, 2, 3], [2, 3], [3]];
        } else if (maxGroupType === 2) {
          optionalGroupSizes = [[1], [1, 2], [2]];
        } else {
          optionalGroupSizes = [[1]];
        }
        const targetGroupsizes = optionalGroupSizes[Math.floor(collageDensity * (optionalGroupSizes.length - 1))];
        // seed += ((collageDensity * 1.5) - 0.75) * numOfOptions;

        remove(groupTypes, groupType => {
          return targetGroupsizes.indexOf(parseInt(groupType)) < 0;
        });

        if (groupTypes.length === 0) {
          groupTypes = ['1'];
        }
      }

      //---------| Calculate a random seed for the collage group type
      const numOfOptions = groupTypes.length;
      let seed;
      if (this.isVertical) {
        //vertical galleries random is not relevant (previous group is in another column)
        seed = utils.hashToInt(this.items[0].hash) % (numOfOptions);
        //console.log('Seed is: ' + seed + '. Found using hash: ' + this.items[0].hash);
      } else {
        seed = (this.inStripIdx + this.stripIdx) % numOfOptions;
      }

      if (this.layoutsVersion === 1 && this.collageAmount) {
        //backwards compatibility
        seed += ((this.collageAmount) - 0.5) * numOfOptions;
      }
      seed = Math.min(Math.max(0, seed), (numOfOptions - 1));
      seed = Math.round(seed);

      //---------| Final group type to render according to:
      // - the number of options
      // - the collageAmount (if 0 - always renders 1 image, if 1 always renders the max amount)
      // - random seed (determined by the hash)
      this.type = groupTypes[seed] || '1';
    }

    //---------| Render the images by the groupType
    let items = [];
    let item;
    let w = 0;
    let h = 0;

    switch (this.type) {
      default:
      case '1' :

        item = this.safeGetItem(0);
        if (item) {
          item.pinToCorner('top-left');
          items.push(item);
          w = item.width;
          h = item.height;
        }

        break;

      case '2v':

        item = this.safeGetItem(0);
        if (item) {
          item.pinToCorner('top-left');
          items.push(item);
          w = item.width;
          h = item.height;
        }

        item = this.safeGetItem(1);
        if (item) {
          item.pinToCorner('bottom-left');
          item.resize(w / item.width);
          h += item.height;
          items.push(item);
        }

        break;

      case '2h':

        item = this.safeGetItem(0);
        if (item) {
          item.pinToCorner('top-left');
          item.innerOffset = [0, 0];
          items.push(item);
          w = item.width;
          h = item.height;
        }

        item = this.safeGetItem(1);
        if (item) {
          item.pinToCorner('top-right');
          item.innerOffset = [0, 0];
          item.resize(h / item.height);
          w += item.width;
          items.push(item);
        }

        break;

      case '3b':

        item = this.safeGetItem(0);
        if (item) {
          item.pinToCorner('top-left');
          items.push(item);
          w = item.width;
          h = item.height;
        }

        item = this.safeGetItem(1);
        if (item) {
          item.pinToCorner('top-right');
          item.resize(h / item.height);
          w += item.width;
          items.push(item);
        }

        item = this.safeGetItem(2);
        if (item) {
          item.pinToCorner('bottom-left');
          item.resize(w / item.width);
          h += item.height;
          items.push(item);
        }

        break;

      case '3t':

        item = this.safeGetItem(1);
        if (item) {
          item.pinToCorner('bottom-left');
          items.push(item);
          w = item.width;
          h = item.height;
        }

        item = this.safeGetItem(2);
        if (item) {
          item.pinToCorner('bottom-right');
          item.resize(h / item.height);
          w += item.width;
          items.push(item);
        }

        item = this.safeGetItem(0);
        if (item) {
          item.pinToCorner('top-left');
          item.resize(w / item.width);
          h += item.height;
          items = [item].concat(items);
        }

        break;

      case '3r':

        item = this.safeGetItem(0);
        if (item) {
          item.pinToCorner('top-left');
          items.push(item);
          w = item.width;
          h = item.height;
        }

        item = this.safeGetItem(1);
        if (item) {
          item.pinToCorner('bottom-left');
          item.resize(w / item.width);
          h += item.height;
          items.push(item);
        }

        item = this.safeGetItem(2);
        if (item) {
          item.pinToCorner('top-right');
          item.resize(h / item.height);
          w += item.width;
          items.push(item);
        }

        break;

      case '3l':

        item = this.safeGetItem(1);
        if (item) {
          item.pinToCorner('top-right');
          items.push(item);
          w = item.width;
          h = item.height;
        }

        item = this.safeGetItem(2);
        if (item) {
          item.pinToCorner('bottom-right');
          item.resize(w / item.width);
          h += item.height;
          items.push(item);
        }

        item = this.safeGetItem(0);
        if (item) {
          item.pinToCorner('top-left');
          item.resize(h / item.height);
          w += item.width;
          items = [item].concat(items);
        }

        break;

      case '3v':

        item = this.safeGetItem(0);
        if (item) {
          item.pinToCorner('top-left');
          item.setPosition('relative');
          items.push(item);
          w = item.width;
          h = item.height;
        }

        item = this.safeGetItem(1);
        if (item) {
          item.setPosition('relative');
          item.resize(w / item.width);
          h += item.height;
          item.pinToCorner('top', (items[0].height / h));
          items.push(item);
        }

        item = this.safeGetItem(2);
        if (item) {
          item.pinToCorner('bottom-left');
          item.setPosition('relative');
          item.resize(w / item.width);
          h += item.height;
          items.push(item);
        }

        break;

      case '3h':

        item = this.safeGetItem(0);
        if (item) {
          item.pinToCorner('top-left');
          item.setPosition('relative');
          items.push(item);
          w = item.width;
          h = item.height;
        }

        item = this.safeGetItem(1);
        if (item) {
          item.setPosition('relative');
          item.resize(h / item.height);
          w += item.width;
          item.pinToCorner('left', (items[0].width / w));
          items.push(item);
        }

        item = this.safeGetItem(2);
        if (item) {
          item.pinToCorner('top-right');
          item.setPosition('relative');
          item.resize(h / item.height);
          w += item.width;
          items.push(item);
        }

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

    if (utils.shouldLog('spacing')) {
      console.log(`SPACING - Group #${this.idx} resizeToHeight H: ${height}`);
      console.log(`SPACING - Group #${this.idx} resizeToHeight W: ${this.width}`);
    }

    const items = includes(['3b', '3r'], this.type) ? this.items.slice().reverse() : this.items;
    for (let item, i = 0; item = items[i]; i++) {
      item.group = {
        top: this.top,
        left: this.left,
        width: this.width,
        height: this.height
      };
      item.offset = {
        bottom: item.offset.top + this.height,
        right: item.offset.left + this.width
      };
      item.resize(this.getItemDimensions(items, i));
    }
  }

  resizeToWidth(width) {

    this.width = width;
    this.height = this.getHeightByWidth(width);

    if (utils.shouldLog('spacing')) {
      console.log(`SPACING - Group #${this.idx} resizeToWidth W: ${width}`);
      console.log(`SPACING - Group #${this.idx} resizeToWidth H: ${this.height}`);
    }

    const items = includes(['3b', '3r'], this.type) ? this.items.slice().reverse() : this.items;
    for (let item, i = 0; item = items[i]; i++) {
      item.group = {
        top: this.top,
        left: this.left,
        width: this.width,
        height: this.height
      };
      item.offset = {
        bottom: item.offset.top + this.height,
        right: item.offset.left + this.width
      };

      item.resize(this.getItemDimensions(items, i));
    }
  }

  getItemDimensions(items, idx) {
    const m = this.imageMargin * 2;
    switch (this.type) {
      default:
      case '1':
      case '2v':
      case '3v': {
        const w = this.width - m;
        return (w > 0) && {
          width: w,
        };
      }
      case '2h':
      case '3h': {
        const h = this.height - m;
        return (h > 0) && {
          height: h,
        };
      }
      case '3t':
      case '3b':
        if (idx === 0) {
          const w = this.width - m;
          return (w > 0) && {
            width: w,
          };
        } else {
          const h = this.height - items[0].height - 2 * m;
          return (h > 0) && {
            height: h,
          };
        }
      case '3r':
      case '3l':
        if (idx === 0) {
          const h = this.height - m;
          return (h > 0) && {
            height: h,
          };
        } else {
          const w = this.width - items[0].width - 2 * m;
          return (w > 0) && {
            width: w,
          };
        }
    }
  }

  getHeightByWidth(W) {
    let Rg = 1;
    let Rm = 1;
    const M = this.imageMargin * 2;
    const R = this.items.map(item => item.width / item.height);
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

    if (utils.shouldLog('spacing')) {
      console.log('SPACING - getHeightByWidth, W: ' + W + ', H:' + H, this.type, Rg, Rm);
    }

    return H;
  }

  getWidthByHeight(H) {
    let Rg = 1;
    let Rm = 1;
    const M = this.imageMargin * 2;
    const R = this.items.map(item => item.width / item.height);
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
        Rg = (R[0] + R[1]);
        Rm = 2 - Rg;
        break;
      case '2v':
        Rg = 1 / (1 / R[0] + 1 / R[1]);
        Rm = 1 - 2 * Rg;
        break;
      case '3h':
        Rg = (R[0] + R[1] + R[2]);
        Rm = 3 - Rg;
        break;
      case '3v':
        Rg = 1 / (1 / R[0] + 1 / R[1] + 1 / R[2]);
        Rm = 1 - 3 * Rg;
        break;
      case '3t':
        Rg = 1 / (1 / (R[2] + R[1]) + 1 / R[0]);
        Rm = ((2 / (R[2] + R[1]) + 1 / R[0]) - 2) * Rg;
        break;
      case '3b':
        Rg = 1 / (1 / (R[0] + R[1]) + 1 / R[2]);
        Rm = ((2 / (R[0] + R[1]) + 1 / R[2]) - 2) * Rg;
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

    if (utils.shouldLog('spacing')) {
      console.log('SPACING - getWidthByHeight, H: ' + H + ', W:' + W, this.type, Rg, Rm);
    }

    return W;
  }

  setTop(top) {
    this.top = top || 0;
    for (let item, i = 0; item = this.items[i]; i++) {
      item.offset = {
        top,
        bottom: top + this.height
      };
    }
  }

  setLeft(left) {
    this.left = left || 0;
    this.right = left + this.width;
    for (let item, i = 0; item = this.items[i]; i++) {
      item.offset = {
        left,
        right: left + this.width
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

  get totalHeight() {
    return this.height + (this.bottomInfoHeight || 0);
  }

  get bottom() {
    return this.top + this.height;
  }

  set items(items) {
    this._items = items;
  }

  get items() {
    return this._items;
  }

  get realItems() {
    return filter(this._items, item => item.type !== 'dummy');
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
        return (i && isInSize);
      }, true);
    }
  }

  get scheme() {
    return {
      id: this.id,
      idx: this.idx,
      type: this.type,
      width: this.width,
      height: this.height,
      totalHeight: this.totalHeight,
      ratio: this.ratio,
      top: this.top,
      left: this.left,
      right: this.right,
      bottom: this.bottom,
      visible: this.visible,
      rendered: this.rendered,
      required: this.required
    };
  }
}

/*
 <img onLoad={() => this.setItemLoaded()} className={'image' + (this.state.loaded ? '' : '-preload')}
 src={this.props.resized_url}/>
 */

