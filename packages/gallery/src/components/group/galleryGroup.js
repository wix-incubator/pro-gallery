////// <reference path="../../reference.ts" />
import utils from '../../utils/index';
import { Group } from 'pro-layouts';

class GalleryGroup {
  constructor(config) {
    this.uniqueId = utils.generateUUID();
    this.isGalleryGroup = true;

    if (config.dto && config.dto.dto) {
      config.dto = config.dto.dto; //defence patch due to mis-use of item-core
      if (utils.isDev()) {
        console.warn('Item core is created with already existing item core');
      }
    }
    this.dto = Object.assign({}, config.dto);
    Object.assign(this, config.dto);

    if (config.scheme) {
      this.processScheme(config.scheme);
    } else {
      this.processScheme(new Group({ dto: config.dto }).scheme);
    }

    if (config.items) {
      this.items = config.items;
    } else {
      console.warn('Pro Gallery created Gallery Group without items', config);
    }
  }

  processScheme(scheme) {
    this.id = scheme.id;
    this.idx = scheme.idx;
    this.width = scheme.width;
    this.height = scheme.height;
    this.totalHeight = scheme.totalHeight;
    this.ratio = scheme.ratio;
    this.top = scheme.top;
    this.left = scheme.left;
    this.right = scheme.right;
    this.bottom = scheme.bottom;
    this.visible = scheme.visible;
    this.rendered = scheme.rendered;
    this.required = scheme.required;
  }

  renderProps(galleryConfig) {
    return {
      className: 'group',
      id: this.id,
      idx: this.idx,
      key: this.key,
      type: this.type,
      top: this.top,
      left: this.left,
      right: this.right,
      bottom: this.bottom,
      width: this.width,
      height: this.height,
      totalHeight: this.totalHeight,
      items: this.items,
      visible: this.visible,
      rendered: this.rendered,
      required: this.required,
      galleryConfig,
    };
  }

  get key() {
    return 'group_' + this.id;
  }
}

export default GalleryGroup;
