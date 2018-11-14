import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/galleryActions.js';
import GalleryView from './galleryView.js';
import SlideshowView from './slideshowView.js';
import {addLayoutStyles} from '../helpers/layoutHelper';
import {ItemsHelper} from '../helpers/itemsHelper';
import dimentionsHelper from '../helpers/dimensionsHelper';
import {calcPosForScrollToItem} from '../helpers/scrollHelper';

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
        isInfinite: this.isInfiniteScroll(),
        left: 0,
        top: 0
      }
    };

    this.getMoreItemsIfNeeded = this.getMoreItemsIfNeeded.bind(this);
    this.toggleInfiniteScroll = this.toggleInfiniteScroll.bind(this); //TODO check if needed
    this.isInfiniteScroll = this.isInfiniteScroll.bind(this); //TODO check if needed
    this.scrollToItem = this.scrollToItem.bind(this);
    this.toggleFullscreen = (typeof props.onItemClicked === 'function') ? (itemIdx => this.props.onItemClicked(this.galleryStructure.items[itemIdx])) : () => {};
  }

  componentDidMount() {
    this.reCreateGalleryExpensively(this.props, () => {
      this.initScrollListener();
    });
  }

  componentWillReceiveProps(nextProps) {
    this.reCreateGalleryExpensively(nextProps);
  }

  reCreateGalleryExpensively({items, styles, container, watermarkData}, callback = () => {}) {
    console.count('PROGALLERY [COUNT] - reCreateGalleryExpensively');
    console.time('PROGALLERY [TIMING] - reCreateGalleryExpensively');
    dimentionsHelper.updateParams({styles, container});

    let _items, _styles, _container, scroll, _scroll;

    const isNew = {
      items: !!items && (!this.state.items || items !== this.props.items),
      styles: !!styles && (!this.state.styles || styles !== this.props.styles),
      container: !!container && (!this.state.container || container !== this.props.container),
      watermark: !!watermarkData && (watermarkData !== this.props.watermarkData),
      scroll: this.state.scroll.isInfinite !== this.props.styles.enableInfiniteScroll,
    };
    isNew.any = Object.keys(isNew).reduce((is, key) => is || isNew[key], false);

    items = items || this.items;

    console.log('PROGALLERY [RENDERS] - reCreateGalleryExpensively', {isNew}, {items, styles, container, watermarkData});

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
      scroll = this.state.scroll;

      _styles = addLayoutStyles(styles, container);
      dimentionsHelper.updateParams({styles: _styles});
      _container = Object.assign({}, container, dimentionsHelper.getGalleryDimensions(), {
        scrollBase: this.getScrollBase(),
        getScrollingElement: this.getScrollingElement(_styles)
      });
      dimentionsHelper.updateParams({container: _container});
      _scroll = Object.assign({}, scroll, {isInfinite: _styles.enableInfiniteScroll});
      newState.styles = _styles;
      newState.container = _container;
      newState.scroll = _scroll;
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
      this.props.handleNewGalleryStructure(_items, _container, _styles, layout, isNew.scroll);
      this.galleryStructure = ItemsHelper.convertToGalleryItems(layout, {
        watermark: watermarkData,
        sharpParams: _styles.sharpParams,
        lastVisibleItemIdx: this.lastVisibleItemIdx,
      });
    }

    if (isNew.any) {
      console.time('PROGALLERY [TIMING] - reCreateGalleryExpensively - newState setting');
      console.log('PROGALLERY [RENDERS] - newState', {newState}, this.items, this.galleryStructure);
      this.setState(newState, () => {
        callback();
        console.timeEnd('PROGALLERY [TIMING] - reCreateGalleryExpensively - newState setting');
        console.timeEnd('PROGALLERY [TIMING] - reCreateGalleryExpensively');
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

  scrollToItem(itemIdx, fixedScroll, isManual) {
    let horizontalElement;
    if (this.props.styles.oneRow) {
      const galleryWrapper = this.galleryWrapper || document; //there is no this.galleryWrapper! TODO
      horizontalElement = galleryWrapper.querySelector('#gallery-horizontal-scroll');
    }
    const pos = calcPosForScrollToItem({
      oneRow: this.props.styles.oneRow,
      galleryWidth: this.state.container.galleryWidth,
      galleryHeight: this.state.container.galleryHeight,
      top: this.state.scroll.top,
      items: this.galleryStructure.items,
      itemIdx,
      fixedScroll,
      isManual,
      horizontalElement,
    });
    utils.setStateAndLog(this, 'Scroll To Item', {
      scrollTop: pos
    }, () => {
      if (this.state.styleParams.oneRow) {
        if (utils.isVerbose()) {
          console.log('Scrolling horiontally', pos, horizontalElement);
        }
        utils.scrollTo(horizontalElement, (Math.round(pos * utils.getViewportScaleRatio())), 400, true);
      } else if (utils.isInWix()) {
        if (utils.isVerbose()) {
          console.log('Scrolling vertically (in wix)');
        }
      } else {
        if (utils.isVerbose()) {
          console.log('Scrolling vertically (not in wix)');
        }
        window.scrollTop = (Math.round(pos * utils.getViewportScaleRatio()));
      }
    });
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

  isInfiniteScroll(styles = this.props.styles) {
    const styleParamsInfiniteScroll = styles.enableInfiniteScroll;//_.get(this, 'state.styleParams.enableInfiniteScroll'); //if undefined -> enable infinite scroll
    const stateInfiniteScroll = this.state && this.state.scroll.isInfinite;//_.get(this, 'state.scroll.isInfinite'); //if defined -> override style params
    const gotStylesParams = styles.gotStyleParams;//_.get(this, 'state.styleParams.gotStyleParams'); //if false -> do not allow infinite scroll yet

    if (!gotStylesParams) {
      return false;
    } else {
      //DO NOT allow infinite scroll only if both styleParams and state are FALSE
      return !!((styleParamsInfiniteScroll || stateInfiniteScroll));
    }
  }
  toggleInfiniteScroll(forceVal) {
    const isInfinite = forceVal || !this.state.scroll.isInfinite;
    this.setState({
      scroll: Object.assign(this.state.scroll,
				{isInfinite}
		)}, () => {
      this.reCreateGalleryExpensively(this.props);
    });
  }
  getMoreItemsIfNeeded(groupIdx) {
    if (this.galleryStructure && groupIdx >= this.galleryStructure.groups.length - 1) { //only when the last group turns visible we should try getting more items
      if (this.props.getMoreItems && !this.gettingMoreItems && this.props.totalItemsCount > this.state.items.length) { //more items can be fetched from the server
        this.gettingMoreItems = true;
        console.error('PROGALLERY [ITEMS] Getting more items', this.state.items.length, this.props.totalItemsCount);
        this.props.getMoreItems(this.state.items.length, newItems => {
          this.reCreateGalleryExpensively({
            items: this.items.concat(newItems.map(item => ItemsHelper.convertDtoToLayoutItem(item)) || [])
          }, () => {
            console.error('PROGALLERY [ITEMS] Got more items', this.state.items.length, this.props.totalItemsCount);
            this.gettingMoreItems = false;
          });
        });
      }
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
    // const scroll = { // SlideshowView need 'top' to be the current pos.
    //   horizontal: this.props.scroll.horizontal,
    //   isInfinite: this.props.scroll.isInfinite,
    //   top: this.props.scroll.left,
    // };
    const ViewComponent = styles.oneRow ? SlideshowView : GalleryView;
    console.log('PROGALLERY [RENDER] - GalleryContainer', this.state.container.scrollBase, {state: this.state, items: this.items});

    return (
      <div style={{background: 'yellowgreen'}} className={`pg-scroll-${this.state.scroll.top}`}>
        <ViewComponent
          totalItemsCount = {this.props.totalItemsCount} //the items passed in the props might not be all the items
          renderedItemsCount = {this.props.renderedItemsCount}
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
            getMoreItemsIfNeeded: this.getMoreItemsIfNeeded,
            toggleInfiniteScroll: this.toggleInfiniteScroll,
            toggleFullscreen: this.toggleFullscreen,
            setWixHeight: _.noop,
            scrollToItem: this.scrollToItem
          })}
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
