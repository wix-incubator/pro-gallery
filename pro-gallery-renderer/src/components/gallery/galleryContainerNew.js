import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/galleryActions.js';
import GalleryView from './galleryView.js';
import SlideshowView from './slideshowView.js';
import {addLayoutStyles} from '../helpers/layoutHelper';
import {ItemsHelper} from '../helpers/itemsHelper';
import dimentionsHelper from '../helpers/dimensionsHelper';
import {scrollToItemImp} from '../helpers/scrollHelper';
import {pauseVideo} from '../../actions/itemViewActions.js';
import {pgScrollSteps, pgScrollClassName} from '../../constants/cssScroll';
import {createLayout} from 'pro-gallery-layouter';
import _ from 'lodash';
import utils from '../../utils';

export class GalleryContainer extends React.Component {

  constructor(props) {
    super(props);
		//
    this.state = {
      pgScroll: 0,
      scroll: {
        isInfinite: this.isInfiniteScroll()
      },
      currentHover: -1
    };

    this.getMoreItemsIfNeeded = this.getMoreItemsIfNeeded.bind(this);
    this.toggleInfiniteScroll = this.toggleInfiniteScroll.bind(this); //TODO check if needed
    this.isInfiniteScroll = this.isInfiniteScroll.bind(this); //TODO check if needed
    this.scrollToItem = this.scrollToItem.bind(this);
    this.toggleFullscreen = (typeof props.onItemClicked === 'function') ? (itemIdx => this.props.onItemClicked(this.galleryStructure.galleryItems[itemIdx])) : () => {};
    //this._scrollingElement = this.getScrollingElement(this.props.styles.isVertical); TODO - i want one call for this function, (same element should be passed in the props and use in the listener)
    this.setCurrentHover = this.setCurrentHover.bind(this);
  }

  componentDidMount() {
    this.reCreateGalleryExpensively(this.props, () => {
      this.getMoreItemsIfNeeded(0);
      this.initScrollListener();
    });
  }
  componentWillUnmount() {
    this.removeScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    this.reCreateGalleryExpensively(nextProps);
    if (!!nextProps.currentIdx && nextProps.currentIdx > 0) {
      this.scrollToItem(nextProps.currentIdx, false, true, 0);
    }
    if (this.props.isInDisplay !== nextProps.isInDisplay) this.handleNavigation(nextProps.isInDisplay);
  }
  handleNavigation(isInDisplay) {
    this.toggleEventListeners(isInDisplay);
    if (isInDisplay) {
      this.props.store.dispatch(actions.toggleIsInView(true));
    }	else {
      this.props.store.dispatch(actions.toggleIsInView(false));
      this.props.store.dispatch(pauseVideo());
    }
  }
  toggleEventListeners(isInDisplay) {
    if (isInDisplay) {
      this.initScrollListener();
    } else this.removeScrollListener(); //for guy to add the remove function
  }
  reCreateGalleryExpensively({items, styles, container, watermarkData}, callback = () => {}) {
    if (utils.isVerbose()) {
      console.time('PROGALLERY [TIMING] - reCreateGalleryExpensively');
    }
    dimentionsHelper.updateParams({styles, container});

    let _items, _styles, _container, scroll, _scroll;

    const isInfiniteScrollChanged = () => {
      if (!this.infiniteScrollChanged && (this.state.scroll.isInfinite !== this.props.styles.enableInfiniteScroll)) {
        this.infiniteScrollChanged = true;
        return true;
      }
      return false;
    };

    const isContainerChanged = () => {
      const containerHasChanged = {
        height: !this.state.styles.oneRow ? false : (!!container.height && (container.height !== this.props.container.height)),
        width: !!container.width && (container.width !== this.props.container.width),
        scrollBase: !!container.scrollBase && (container.scrollBase !== this.props.container.scrollBase),
      };
      return Object.keys(containerHasChanged).reduce((is, key) => is || containerHasChanged[key], false);
    };

    const isNew = {
      items: !!items && (!this.state.items || items !== this.props.items),
      styles: !!styles && (!this.state.styles || styles !== this.props.styles),
      container: !this.state.styles || !this.state.container || (!!container && isContainerChanged()),
      watermark: !!watermarkData && (watermarkData !== this.props.watermarkData),
      scroll: isInfiniteScrollChanged(),
    };
    isNew.any = Object.keys(isNew).reduce((is, key) => is || isNew[key], false);

    items = items || this.items;


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
      });
      dimentionsHelper.updateParams({container: _container});
      _scroll = Object.assign({}, scroll, {isInfinite: isNew.styles ? _styles.enableInfiniteScroll : this.isInfiniteScroll()});
      newState.styles = _styles;
      newState.container = _container;
      newState.scroll = _scroll;
    } else {
      _styles = this.state.styles;
      _container = this.state.container;
    }

    if (!this.galleryStructure || isNew.any) {
      if (utils.isVerbose()) {
        console.count('PROGALLERY [COUNT] - reCreateGalleryExpensively');
      }
      const layoutParams = {
        items: _items,
        container: _container,
        styleParams: _styles,
        gotScrollEvent: true,
        showAllItems: true
      };

      const layout = createLayout(layoutParams);
      const isInfinite = (isNew.scroll || _styles.enableInfiniteScroll || this.infiniteScrollChanged) && !_styles.oneRow;
      this.props.handleNewGalleryStructure({items: _items, container: _container, styles: _styles, layout, isInfinite});
      this.galleryStructure = ItemsHelper.convertToGalleryItems(layout, {
        watermark: watermarkData,
        sharpParams: _styles.sharpParams,
        lastVisibleItemIdx: this.lastVisibleItemIdx,
      });
    }

    if (isNew.any) {
      if (utils.isVerbose()) {
        console.time('PROGALLERY [TIMING] - reCreateGalleryExpensively - newState setting');
        console.log('PROGALLERY [RENDERS] - newState', {newState}, this.items, this.galleryStructure);
      }
      this.setState(newState, () => {
        callback();
        if (utils.isVerbose()) {
          console.timeEnd('PROGALLERY [TIMING] - reCreateGalleryExpensively - newState setting');
          console.timeEnd('PROGALLERY [TIMING] - reCreateGalleryExpensively');
        }
      });
    } else {
      callback();
    }
    if (utils.isVerbose()) {
      console.log('PROGALLERY [RENDERS] - reCreateGalleryExpensively', {isNew}, {items, styles, container, watermarkData});
    }
  }

  getScrollBase() {
    let scrollBase = this.props.container.scrollBase;
    const {y} = window.document.getElementById(`pro-gallery-${this.props.domId}`).getBoundingClientRect();
    scrollBase += y;
    return scrollBase;
  }

  getScrollingElement(oneRow) {
    const horizontal = oneRow ? () => window.document.querySelector(`#pro-gallery-${this.props.domId} #gallery-horizontal-scroll`) : () => {};
    const vertical = this.props.scrollingElement ? ((typeof this.props.scrollingElement === 'function') ? this.props.scrollingElement : () => this.props.scrollingElement) : () => window;
    return {vertical, horizontal};
  }

  scrollToItem(itemIdx, fixedScroll, isManual, durationInMS = 0) {
    const scrollingElement = this.getScrollingElement(this.state.styles.oneRow);
    const horizontalElement = scrollingElement.horizontal();
    scrollToItemImp({
      oneRow: this.state.styles.oneRow,
      galleryWidth: this.state.container.galleryWidth,
      galleryHeight: this.state.container.galleryHeight,
      top: this.state.scroll.top,
      items: this.galleryStructure.items,
      itemIdx,
      fixedScroll,
      isManual,
      scrollingElement,
      horizontalElement,
      durationInMS,
    });
  }

  removeScrollListener() {
    if (this.scrollEventListenerSet) {
      this.scrollEventListenerSet = false;
      const scrollingElement = this.getScrollingElement(this.state.styles.oneRow);
      scrollingElement.vertical().removeEventListener('scroll', this.onVerticalScroll);
      const {oneRow} = this.state.styles;
      if (oneRow) {
        scrollingElement.horizontal().removeEventListener('scroll', this.onHorizontalScroll);
      }
    }
  }

  initScrollListener() {
    if (!this.scrollEventListenerSet) {
      this.scrollEventListenerSet = true;
      const scrollInterval = 500;

      const scrollingElement = this.getScrollingElement(this.state.styles.oneRow);
      const {oneRow} = this.state.styles;
      if (oneRow) {
        //Horizontal Scroll
        this.onHorizontalScroll = _.throttle(e => {
          const left = (e.target && e.target.scrollLeft) || 0;
          this.getMoreItemsIfNeeded(left);
          this.setState({
            pgScroll: left
          });
        }, scrollInterval);
        scrollingElement.horizontal().addEventListener('scroll', this.onHorizontalScroll);
      } else {
        //Vertical Scroll
        this.onVerticalScroll = _.throttle(e => {
          this.getMoreItemsIfNeeded(e.scrollTop);
          this.setState({
            pgScroll: e.scrollTop
          });
        }, scrollInterval);
        scrollingElement.vertical().addEventListener('scroll', this.onVerticalScroll);
      }
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

  setCurrentHover(idx) {
    this.setState(
      {currentHover: idx}
    );
  }

  getMoreItemsIfNeeded(scrollTop) {
    if (this.galleryStructure && this.props.getMoreItems && !this.gettingMoreItems && this.props.totalItemsCount > this.state.items.length) { //more items can be fetched from the server

      //TODO - add support for horizontal galleries
      const galleryHeight = (this.galleryStructure.height);
      const scrollHeight = scrollTop + this.state.container.scrollBase + window.screen.height;
      const getItemsDistance = window.screen.height;

      if (galleryHeight - scrollHeight < getItemsDistance) { //only when the last item turns visible we should try getting more items
        this.gettingMoreItems = true;
        this.props.getMoreItems(this.state.items.length, newItems => {
          this.reCreateGalleryExpensively({
            items: this.items.concat(newItems.map(item => ItemsHelper.convertDtoToLayoutItem(item)) || [])
          }, () => {
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
    if (can && utils.isVerbose()) {
      console.log('PROGALLERY [CAN_RENDER] GalleryContainer', this.domId, can, this.state.container, this.state.styles, this.state.items);
    }
    return can;
  }

  render() {

    if (!this.canRender()) {
      return null;
    }

    const {styles} = this.state;
    const ViewComponent = styles.oneRow ? SlideshowView : GalleryView;
    if (utils.isVerbose()) {
      console.time('PROGALLERY [COUNTS] - GalleryContainer (render)');
      console.log('PROGALLERY [RENDER] - GalleryContainer', this.state.container.scrollBase, {state: this.state, items: this.items});
    }

    const pgScroll = pgScrollSteps.map((step, idx) => `${pgScrollClassName}-${idx}-${Math.floor(this.state.pgScroll / step) * step}`).join(' ');

    return (
      <div className={pgScroll}>
        <ViewComponent
					scrollingElement = {this.getScrollingElement(this.state.styles.oneRow)}
          totalItemsCount = {this.props.totalItemsCount} //the items passed in the props might not be all the items
          renderedItemsCount = {this.props.renderedItemsCount}
          items = {this.items}
          galleryStructure = {this.galleryStructure}
          styleParams = {styles}
          container = {this.state.container}
          watermark = {this.props.watermarkData}
          settings = {this.props.settings}
          gotScrollEvent = {true}
          scroll = {{isInfinite: this.state.scroll.isInfinite}}
          convertToGalleryItems = {ItemsHelper.convertToGalleryItems}
          convertDtoToLayoutItem = {ItemsHelper.convertDtoToLayoutItem}
          domId = {this.props.domId}
          currentHover = {this.state.currentHover}
          actions = {_.merge(this.props.actions, {
            toggleInfiniteScroll: this.toggleInfiniteScroll,
            toggleFullscreen: this.toggleFullscreen,
            setWixHeight: _.noop,
            scrollToItem: this.scrollToItem,
            setCurrentHover: this.setCurrentHover
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
