import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/galleryActions.js';
import GalleryView from './galleryView.js';
import SlideshowView from './slideshowView.js';
import {addLayoutStyles} from '../helpers/layoutHelper';
import {ItemsHelper} from '../helpers/itemsHelper';
import dimentionsHelper from '../helpers/dimensionsHelper';

import {createLayout} from 'pro-gallery-layouter';
import GalleryItem from '../item/galleryItem';
import GalleryGroup from '../group/galleryGroup';
import _ from 'lodash';
import utils from '../../utils';
import {spacingVersionManager} from 'photography-client-lib/dist/src/versioning/features/spacing';
import {layoutsVersionManager} from 'photography-client-lib/dist/src/versioning/features/layouts';
import {itemActions} from 'photography-client-lib/dist/src/item/itemActions';
import {logger} from 'photography-client-lib/dist/src/utils/biLogger';
import Wix from 'photography-client-lib/dist/src/sdk/WixSdkWrapper';
import Consts from 'photography-client-lib/dist/src/utils/consts';
import axios from 'axios';
import prependHttpExtra from 'prepend-http-extra';


export class GalleryContainer extends React.Component {

  constructor(props) {
    super(props);
    //
    this.state = {
      scroll: {
        isInfinite: false,
        left: 0,
        top: 0
      }
    };
  }

  componentDidMount() {
    this.reCreateGallery(this.props, () => {
      this.initScrollListener();
    });
  }

  componentWillReceiveProps(nextProps) {
    this.reCreateGallery(nextProps);
  }

  reCreateGallery({items, styles, container, watermarkData}, callback = () => {}) {
    console.count('PROGALLERY [COUNT] - reCreateGallery');
    console.time('PROGALLERY [TIMING] - reCreateGallery');
    dimentionsHelper.updateStyles(styles);
    dimentionsHelper.updateContainer(container);
    let _items, _styles, _container;

    const isNew = {
      items: !!items && (!this.state.items || items !== this.props.items),
      styles: !!styles && (!this.state.styles || styles !== this.props.styles),
      container: !!container && (!this.state.container || container !== this.props.container),
      watermark: !!watermarkData && (watermarkData !== this.props.watermarkData),
    };
    isNew.any = Object.keys(isNew).reduce((is, key) => is || isNew[key], false);

    items = items || this.items;

    console.log('PROGALLERY [RENDERS] - reCreateGallery', {isNew}, {items, styles, container, watermarkData});

    const newState = {};

    if (isNew.items) {
      _items = items.map(item => ItemsHelper.convertDtoToLayoutItem(item));
      this.items = _items;
      newState.items = _items.map(item => item.id);
    } else {
      _items = this.items;
    }

    if (isNew.styles || isNew.container) {
      styles = styles || this.state.styles;
      container = container || this.state.container;

      _styles = addLayoutStyles(styles, container);
      dimentionsHelper.updateStyles(_styles);
      _container = Object.assign({}, container, dimentionsHelper.getGalleryDimensions(), {
        scrollBase: this.getScrollBase(),
        getScrollingElement: this.getScrollingElement(_styles)
      });
      dimentionsHelper.updateContainer(_container);
      newState.styles = _styles;
      newState.container = _container;
    } else {
      _styles = this.state.styles;
      _container = this.state.container;
    }

    if (!this.galleryStructure || isNew.any) {
      const layoutParams = {
        items: _items,
        container: _container,
        styleParams: _styles,
        gotScrollEvent: true,
        showAllItems: true
      };

      const layout = createLayout(layoutParams);

      this.galleryStructure = ItemsHelper.convertToGalleryItems(layout, {
        watermark: watermarkData,
        sharpParams: _styles.sharpParams
      });
    }

    if (isNew.any) {
      console.time('PROGALLERY [TIMING] - reCreateGallery - newState setting');
      console.log('PROGALLERY [RENDERS] - newState', {newState}, this.items, this.galleryStructure);
      this.setState(newState, () => {
        callback();
        console.timeEnd('PROGALLERY [TIMING] - reCreateGallery - newState setting');
        console.timeEnd('PROGALLERY [TIMING] - reCreateGallery');
      });
    } else {
      callback();
    }
  }

  getScrollBase() {
    let scrollBase = this.props.container.scrollBase;
    const {y} = document.getElementById(`pro-gallery-${this.props.domId}`).getBoundingClientRect();
    scrollBase += y;
    return scrollBase;
  }

  getScrollingElement(oneRow) {
    const horizontal = oneRow ? () => document.querySelector(`#pro-gallery-${this.props.domId} #gallery-horizontal-scroll`) : () => {};
    const vertical = this.props.getScrollingElement ? ((typeof this.props.getScrollingElement === 'function') ? this.props.getScrollingElement : () => this.props.getScrollingElement) : () => window;
    return {vertical, horizontal};
  }

  initScrollListener() {
    const scrollInterval = 500;

    //Vertical Scroll
    this.onVerticalScroll = _.throttle(({target}) => {
      this.setState({
        scroll: Object.assign(this.state.scroll, {
          top: target.scrollTop,
          vertical: target
        })
      });
    }, scrollInterval);
    const scrollingElement = this.getScrollingElement(this.state.styles.oneRow);
    scrollingElement.vertical().addEventListener('scroll', this.onVerticalScroll);

    //Horizontal Scroll
    const {oneRow} = this.state.styles;
    if (oneRow) {
      this.onHorizontalScroll = _.throttle(({target}) => {
        this.setState({
          scroll: Object.assign(this.state.scroll, {
            left: target.scrollLeft,
            horizontal: target
          })
        });
      }, scrollInterval);
      scrollingElement.horizontal().addEventListener('scroll', this.onHorizontalScroll);
    }
  }

  getMoreItemsIfNeeded(groupIdx) {
    if (this.props.getMoreItems && !this.gettingMoreItems && this.props.totalItemsCount > this.state.items.length && groupIdx === this.galleryStructure.groups.length - 1) {
        //this is the last group
      this.gettingMoreItems = true;
      console.error('PROGALLERY [ITEMS] Getting more items', this.state.items.length, this.props.totalItemsCount);
      this.props.getMoreItems(this.state.items.length, newItems => {
        this.reCreateGallery({
          items: this.items.concat(newItems.map(item => ItemsHelper.convertDtoToLayoutItem(item)) || [])
        }, () => {
          console.error('PROGALLERY [ITEMS] Got more items', this.state.items.length, this.props.totalItemsCount);
          this.gettingMoreItems = false;
        });
      });
    }
    return false;
  }

  canRender() {
    const can = (
      this.state.container &&
      this.state.styles &&
      this.state.items
    );

    !can && console.log('PROGALLERY [CAN_RENDER] GalleryContainer', this.domId, can, this.state.container, this.state.styles, this.state.items);

    return can;
  }

  render() {

    if (!this.canRender()) {
      return null;
    }

    console.time('PROGALLERY [COUNTS] - GalleryContainer (render)');

    const {styles} = this.state;
    const ViewComponent = styles.oneRow ? SlideshowView : GalleryView;
    console.log('PROGALLERY [RENDER] - GalleryContainer', this.state.container.scrollBase, {state: this.state, items: this.items});

    return (
      <div style={{background: 'yellowgreen'}}>
    <ViewComponent
      totalItemsCount = {this.props.totalItemsCount} //the items passed in the props might not be all the items
      items = {this.items}
      galleryStructure = {this.galleryStructure}
      styleParams = {styles}
      container = {this.state.container}
      watermark = {this.props.watermarkData}
      settings = {this.props.settings}
      gotScrollEvent = {true}
      scroll = {this.state.scroll}
      convertToGalleryItems = {ItemsHelper.convertToGalleryItems}
      convertDtoToLayoutItem = {ItemsHelper.convertDtoToLayoutItem}
      domId = {this.props.domId}
      actions = {_.merge(this.props.actions, {
        getMoreItemsIfNeeded: this.getMoreItemsIfNeeded.bind(this),
        toggleInfiniteScroll: this.toggleInfiniteScroll,
        toggleFullscreen: this.toggleFullscreen,
        setWixHeight: this.setWixHeight,
        scrollToItem: this.scrollToItem
      })}
      debug = {{
        lastHeight: this.lastHeight,
        newHeight: this.newHeight,
        resizeCount: this.resizeCount,
        orientationCount: this.orientationCount,
        maxGalleryWidth: this.props.maxGalleryWidth
      }}
      store = {this.props.store}
      { ...this.props.gallery }
  />
  </div>
    );
  }
}

function mapStateToProps(state) {
  return state.gallery;
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(GalleryContainer);

