////// <reference path="../../reference.ts" />
import {utils} from '../../utils/index'
import {ItemCore} from '../../_domain/item-core'

class ItemLayout extends ItemCore {

  constructor(config) {
    super(config);
    this.idx = config.idx;
    this.smartCrop = config.smartCrop;
    this.createdBy = config.createdBy;
    this.container = config.container;
    this._offset = {};
    this._group = {};

    this.uniqueId = utils.getUUID();
    if (!utils.isSemiNative()) {
      this.resize(1);
    }
  }

}

/*
 <img onLoad={() => this.setItemLoaded()} className={'image' + (this.state.loaded ? '' : '-preload')}
 src={this.props.resized_url}/>
 */

export default ItemLayout;
