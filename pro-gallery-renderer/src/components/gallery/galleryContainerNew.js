import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/galleryActions.js';
import videoActionTypes from '../../constants/videoActionTypes';
import GalleryView from './galleryView.js';
import SlideshowView from './slideshowView.js';
import {addLayoutStyles} from '../helpers/layoutHelper';
import {ItemsHelper} from '../helpers/itemsHelper';
import dimentionsHelper from '../helpers/dimensionsHelper';
import {scrollToItemImp} from '../helpers/scrollHelper';
import {pauseVideo} from '../../actions/itemViewActions.js';
import window from 'photography-client-lib/dist/src/sdk/windowWrapper';
import CssSrollIndicator from './galleryCssScrollIndicator';
import {Layouter} from 'pro-gallery-layouter';
import {cssScrollHelper} from '../helpers/cssScrollHelper.js';
import {createCssLayouts} from '../helpers/cssLayoutsHelper.js';
import _ from 'lodash';
import utils from '../../utils';

export class GalleryContainer extends React.Component {

  constructor(props) {
    super(props);
    console.count('[OOISSR] galleryContainerNew constructor', window.isMock);

    const initialState = {
      pgScroll: 0,
      showMoreClicked: false,
      currentHover: -1
    };

    this.items = [];
    this.itemsDimensions = {};
    this.preloadedItems = {};

    const galleryState = this.reCreateGalleryExpensively(props, initialState);

    this.state = {
      ...initialState,
      ...galleryState,
    };

    this.getMoreItemsIfNeeded = this.getMoreItemsIfNeeded.bind(this);
    this.toggleInfiniteScroll = this.toggleInfiniteScroll.bind(this); //TODO check if needed
    this.scrollToItem = this.scrollToItem.bind(this);
    this.toggleFullscreen = (typeof props.onItemClicked === 'function') ? (itemIdx => this.props.onItemClicked(this.galleryStructure.galleryItems[itemIdx])) : () => {};
    this._scrollingElement = this.getScrollingElement();
    this.setCurrentHover = this.setCurrentHover.bind(this);
  }

  componentDidMount() {
    this.getMoreItemsIfNeeded(0);
    this.loadItemsDimensions();
    //calcScrollBase (read the dom)
    this.setState({
      container: Object.assign({}, this.state.container, dimentionsHelper.getGalleryDimensions(), {
        scrollBase: this.calcScrollBase(this.state.container),
      })
    }, () => {
      this.handleNewGalleryStructure();
    });

  }

  componentWillReceiveProps(nextProps) {
    const galleryState = this.reCreateGalleryExpensively(nextProps);
    if (Object.keys(galleryState).length > 0) {
      this.setState(galleryState, () => {
        this.handleNewGalleryStructure();
      });
    }

    if (!!nextProps.currentIdx && nextProps.currentIdx > 0) {
      this.scrollToItem(nextProps.currentIdx, false, true, 0);
    }

    if (this.props.isInDisplay !== nextProps.isInDisplay) this.handleNavigation(nextProps.isInDisplay);
  }

  loadItemsDimensions() { //TODO: move call to handleNewGalleryStructure

    const preloadItem = (item, onload) => {
      if (!item || !item.itemId || !item.isGalleryItem) {
        return;
      }
      try {
        const id = item.itemId;
        if (typeof this.preloadedItems[id] !== 'undefined') {
          return;
        }
        this.preloadedItems[id] = new Image();
        if (utils.isVerbose()) {
          console.log('Preloading item #' + item);
        }
        this.preloadedItems[id].src = item.thumbnail_url.img;
        if (typeof onload === 'function') {
          this.preloadedItems[id].onload = e => {
            onload(e);
          };
        }
        return this.preloadedItems[id];
      } catch (e) {
        console.error('Could not preload item', item, e);
        return;
      }
    };

    const throttledReCreateGallery = _.throttle(() => {
      const newState = this.reCreateGalleryExpensively(this.props, this.state);
      if (Object.keys(newState).length > 0) {
        this.setState(newState, () => {
          this.handleNewGalleryStructure();
        });
      }
    }, 1000);

    const {galleryItems} = this.galleryStructure;

    if (!galleryItems) {
      return;
    }

    const itemsWithoutDimensions = galleryItems.filter((item, idx) => {
      try {
        return (item.isVisible && item.isDimensionless);
      } catch (e) {
        return false;
      }
    });

    this.itemsDimensions = {};
    itemsWithoutDimensions.forEach((item, idx, items) => {
      preloadItem(item, e => {
        try {
          if (utils.isVerbose()) {
            console.log('item loaded event', idx, e);
          }
          const ele = e.srcElement;
          const _item = this.items.find(itm => itm.itemId === item.itemId);
          if (_item) {
            this.itemsDimensions[_item.itemId] = {
              width: ele.width,
              height: ele.height,
            };

            //rebuild the gallery after every dimension update
            if (Object.keys(this.itemsDimensions).length > 0) {
              throttledReCreateGallery();
            }

          }
        } catch (e) {
          console.error('Could not calc element dimensions', e);
        }
      });
    });

  }

  handleNavigation(isInDisplay) {
    if (isInDisplay) {
      this.props.store.dispatch(actions.toggleIsInView(true));
    }	else {
      this.props.store.dispatch(actions.toggleIsInView(false));
      this.props.store.dispatch(pauseVideo());
    }
  }

  handleNewGalleryStructure() {
    //should be called AFTER new state is set
    if (typeof this.props.handleNewGalleryStructure === 'function') {
      const {items, container, styles} = this.state;
      const {layout} = this;
      const isInfinite = this.containerGrowthDirection() === 'vertical';
      this.props.handleNewGalleryStructure({items, container, styles, layout, isInfinite});
    }
  }

  isNew({items, styles, container, watermarkData}, state) {

    const containerHadChanged = container => {
      if (!state.styles || !state.container) {
        return true; //no old container or styles (style may change container)
      }
      if (!container) {
        return false; // no new continainer
      }
      const containerHasChanged = {
        height: !state.styles.oneRow && state.styles.enableInfiniteScroll ? false : (!!container.height && (container.height !== this.props.container.height)),
        width: !!container.width && (container.width !== this.props.container.width),
        scrollBase: !!container.scrollBase && (container.scrollBase !== this.props.container.scrollBase),
      };
      return Object.keys(containerHasChanged).reduce((is, key) => is || containerHasChanged[key], false);
    };

    const stylesHaveChanged = styles => {
      if (!styles) {
        return false; //no new styles - use old styles
      }
      if (!state.styles) {
        return true; //no old styles
      }
      try {
        return (JSON.stringify(styles) !== JSON.stringify(this.props.styles));
      } catch (e) {
        console.error('Could not compare styles', e);
        return false;
      }
    };

    const itemsWereAdded = items => {
      const _items = this.items;
      if (items === this.items) {
        return false; //it is the exact same object
      }
      if (!items) {
        return false; // new items do not exist (use old items)
      }
      if (!state.items || !_items) {
        return false; // old items do not exist (it is not items addition)
      }
      if (_items.length >= items.length) {
        return false; // more old items than new items
      }
      return _items.reduce((is, _item, idx) => {
        //check that all the existing items exist in the new array
        return is && _item.id === items[idx].itemId;
      }, true);
    };

    const itemsHaveChanged = items => {
      const _items = this.items;
      if (items === this.items) {
        return false; //it is the exact same object
      }
      if (!items) {
        return false; // new items do not exist (use old items)
      }
      if (!state.items || !_items) {
        return true; // old items do not exist
      }
      if (_items.length !== items.length) {
        return true; // more new items than old items (or vice versa)
      }
      return items.reduce((is, item, idx) => {
        //check that all the items' ids are identical
        return is || !item || !_items[idx] || item.itemId !== _items[idx].id;
      }, false);
    };

    const isNew = {
      items: itemsHaveChanged(items),
      addedItems: itemsWereAdded(items),
      styles: stylesHaveChanged(styles),
      container: containerHadChanged(container),
      watermark: !!watermarkData && (watermarkData !== this.props.watermarkData),
    };
    isNew.str = Object.entries(isNew).map(([key, is]) => is ? key : '').join('');
    isNew.any = isNew.str.length > 0;

    // if (!isNew.any) {
    //   console.count('Tried recreating gallery with no new params');
    // } else {
    //   console.count('Recreating gallery with new params');
    // }

    return isNew;
  }

  reCreateGalleryExpensively({items, styles, container, watermarkData}, curState) {

    if (utils.isVerbose()) {
      console.count('PROGALLERY [COUNT] reCreateGalleryExpensively');
    }
    const isFullwidth = (container && ((container.width === '100%' /*regular*/) || (container.width === '' /*mesh*/)));
    if (isFullwidth) {
      container.width = window.isMock ? utils.getScreenWidth() : window.innerWidth;
    }
    const state = curState || this.state || {};

    let _styles, _container, scroll, _scroll;
    items = items || this.items;
    Object.entries(this.itemsDimensions).forEach(([itemId, itemDim]) => {
      const item = items.find(itm => itm.itemId === itemId);
      Object.assign(item.metaData, itemDim);
    });

    const isNew = this.isNew({items, styles, container, watermarkData}, state);
    const newState = {};

    if (utils.isVerbose()) {
      console.log('PROGALLERY reCreateGalleryExpensively', isNew, {items, styles, container, watermarkData});
    }

    if (isNew.items && !isNew.addedItems) {
      this.items = items.map(item => {
        return ItemsHelper.convertDtoToLayoutItem(item);
      });
      newState.items = this.items.map(item => item.id);
      this.gettingMoreItems = false; //probably finished getting more items
    } else if (isNew.addedItems) {
      this.items = this.items.concat(items.slice(this.items.length).map(item => {
        return ItemsHelper.convertDtoToLayoutItem(item);
      }));
      newState.items = this.items.map(item => item.id);
      this.gettingMoreItems = false; //probably finished getting more items
    }
    const _items = this.items;

    if (isNew.styles || isNew.container) {
      styles = styles || state.styles;
      container = container || state.container;
      scroll = state.scroll;

      dimentionsHelper.updateParams({styles, container});
      _styles = addLayoutStyles(styles, container);
      dimentionsHelper.updateParams({styles: _styles});
      _container = Object.assign({}, container, dimentionsHelper.getGalleryDimensions(), {
        scrollBase: this.calcScrollBase(container),
      });
      dimentionsHelper.updateParams({container: _container});
      newState.styles = _styles;
      newState.container = _container;
    } else {
      _styles = state.styles;
      _container = state.container;
    }

    if (!this.galleryStructure || isNew.any) {
      if (utils.isVerbose()) {
        console.count('PROGALLERY [COUNT] - reCreateGalleryExpensively (isNew)');
      }
      const layoutParams = {
        items: _items,
        container: _container,
        styleParams: _styles,
        gotScrollEvent: true,
        options: {
          showAllItems: true,
          skipVisibilitiesCalc: true,
          useLayoutStore: false
        }
      };

      if (this.layouter && isNew.addedItems) {
        layoutParams.options.useExistingLayout = true;
      } else {
        layoutParams.options.createLayoutOnInit = false;
        this.layouter = new Layouter(layoutParams);
      }

      this.props.store.dispatch({
        type: videoActionTypes.videoModeChanged,
        payload: _styles.videoPlay
      });

      this.layout = this.layouter.createLayout(layoutParams);

      if (isNew.addedItems) {
        const existingLayout = this.galleryStructure || this.layout;
        this.galleryStructure = ItemsHelper.convertExistingStructureToGalleryItems(existingLayout, this.layout, {
          watermark: watermarkData,
          sharpParams: _styles.sharpParams,
          lastVisibleItemIdx: this.lastVisibleItemIdx,
        });
      } else {
        this.galleryStructure = ItemsHelper.convertToGalleryItems(this.layout, {
          watermark: watermarkData,
          sharpParams: _styles.sharpParams,
          lastVisibleItemIdx: this.lastVisibleItemIdx,
        });
      }
      if (window.isSSR && isFullwidth) {
        console.time('fullwidthLayoutsCss!');
        this.fullwidthLayoutsCss = createCssLayouts(layoutParams, utils.isMobile());
        console.timeEnd('fullwidthLayoutsCss!');
      } else {
        this.fullwidthLayoutsCss = [];
      }

      this.scrollCss = cssScrollHelper.calcScrollCss({
        items: this.galleryStructure.galleryItems,
        styleParams: _styles,
        scrollBase: _container.scrollBase
      });

    }

    if (utils.isVerbose()) {
      console.log('PROGALLERY [RENDERS] - reCreateGalleryExpensively', {isNew}, {items, styles, container, watermarkData});
    }

    if (isNew.any) {
      return (newState);
    } else {
      return {};
    }
  }

  calcScrollBase(container) {
    container = container || this.props.container;
    let {scrollBase} = container;
    try {
      if (!(scrollBase >= 0)) {
        scrollBase = 0;
      }
      const {y} = window.document.getElementById(`pro-gallery-${this.props.domId}`).getBoundingClientRect();
      if (y >= 0) {
        scrollBase += y;
      }
    } catch (e) {
      //
    }
    return scrollBase;
  }

  getScrollingElement() {
    const horizontal = () => window.document.querySelector(`#pro-gallery-${this.props.domId} #gallery-horizontal-scroll`);
    const vertical = this.props.scrollingElement ? ((typeof this.props.scrollingElement === 'function') ? this.props.scrollingElement : () => this.props.scrollingElement) : () => window;
    return {vertical, horizontal};
  }

  scrollToItem(itemIdx, fixedScroll, isManual, durationInMS = 0) {
    const scrollingElement = this._scrollingElement;
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

  containerGrowthDirection() {
    // return the direction in which the gallery can grow on it's own (aka infinite scroll)
    const {enableInfiniteScroll, gotStyleParams} = this.props.styles;
    const {showMoreClicked} = this.state;
    const {oneRow} = this.state.styles;
    if (oneRow) {
      return 'horizontal';
    } else if (!gotStyleParams || (!enableInfiniteScroll && !showMoreClicked)) {
      return 'none'; //vertical gallery with showMore button enabled and not clicked
    } else {
      return 'vertical';
    }
  }

  toggleInfiniteScroll(forceVal) {
    if (forceVal !== this.state.showMoreClicked) { //forceVal is undefined or different than existing val
      const showMoreClicked = forceVal || !this.state.showMoreClicked;
      this.setState({
        showMoreClicked
      }, () => {
        this.handleNewGalleryStructure();
      });
    }
  }

  setCurrentHover(idx) {
    this.setState(
      {currentHover: idx}
    );
  }

  getMoreItemsIfNeeded(scrollPos) {
    if (this.galleryStructure && this.props.getMoreItems && !this.gettingMoreItems && this.props.totalItemsCount > this.state.items.length) { //more items can be fetched from the server
      //TODO - add support for horizontal galleries
      const {oneRow} = this.state.styles;

      const gallerySize = (oneRow ? this.galleryStructure.columns[0].width : this.galleryStructure.height);
      const scrollEnd = (oneRow ? scrollPos + window.screen.width : scrollPos + this.state.container.scrollBase + window.screen.height);
      const getItemsDistance = 2 * (oneRow ? window.screen.width : window.screen.height);

      if (gallerySize - scrollEnd < getItemsDistance) { //only when the last item turns visible we should try getting more items
        this.gettingMoreItems = true;
        this.props.getMoreItems(this.state.items.length);
        setTimeout(() => {
          //wait a bit before allowing more items to be fetched - ugly hack before promises still not working
          this.gettingMoreItems = false;
        }, 2000);
        console.error('Could not get more items from server: itemsPromise is not a promise?!?!?');
      }
    }
  }

  canRender() {
    const can = (
      this.state.container &&
      this.state.styles &&
      this.state.items
    );
    if (!can && utils.isVerbose()) {
      console.log('PROGALLERY [CAN_RENDER] GalleryContainer', this.state, can, this.state.container, this.state.styles, this.state.items);
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

    if (typeof this.props.onAppLoaded === 'function') {
      this.props.onAppLoaded();
    }
    const displayShowMore = this.containerGrowthDirection() === 'none';

    return (
      <div>
        {this.fullwidthLayoutsCss.map((css, idx) => <style key={`cssLayout-${idx}`}>{css}</style>)}
        <style key="scrollCss">{this.scrollCss}</style>
				<CssSrollIndicator oneRow={this.state.styles.oneRow} scrollingElement={this._scrollingElement} getMoreItemsIfNeeded={this.getMoreItemsIfNeeded}/>
				<ViewComponent
					isInDisplay = {this.props.isInDisplay}
					scrollingElement = {this._scrollingElement}
          totalItemsCount = {this.props.totalItemsCount} //the items passed in the props might not be all the items
          renderedItemsCount = {this.props.renderedItemsCount}
          items = {this.items}
          galleryStructure = {this.galleryStructure}
          styleParams = {styles}
          container = {this.state.container}
          watermark = {this.props.watermarkData}
          settings = {this.props.settings}
          gotScrollEvent = {true}
          scroll={{}} //todo: remove after refactor is 100%
          displayShowMore = {displayShowMore}
          domId = {this.props.domId}
          currentHover = {this.state.currentHover}
          actions = {_.merge(this.props.actions, {
            findNeighborItem: this.layouter.findNeighborItem,
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
