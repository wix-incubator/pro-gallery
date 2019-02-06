import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/galleryActions.js';
import videoActionTypes from '../../constants/videoActionTypes';
import GalleryView from './galleryView.js';
import SlideshowView from './slideshowView.js';
import {addLayoutStyles} from '../helpers/layoutHelper';
import {ItemsHelper} from '../helpers/itemsHelper';
import dimensionsHelper from '../helpers/dimensionsHelper';
import {scrollToItemImp} from '../helpers/scrollHelper';
import {pauseVideo} from '../../actions/itemViewActions.js';
import window from 'photography-client-lib/dist/src/sdk/windowWrapper';
import CssScrollIndicator from './galleryCssScrollIndicator';
import {Layouter} from 'pro-gallery-layouter';
import {cssScrollHelper} from '../helpers/cssScrollHelper.js';
import {createCssLayouts} from '../helpers/cssLayoutsHelper.js';
import _ from 'lodash';
import utils from '../../utils';

export class GalleryContainer extends React.Component {

  constructor(props) {
    super(props);
    if (utils.isVerbose()) {
      console.count('[OOISSR] galleryContainerNew constructor', window.isMock);
    }

    const initialState = {
      pgScroll: 0,
      showMoreClicked: false,
      currentHover: -1
    };

    this.items = [];
    this.itemsDimensions = {};
    this.preloadedItems = {};

    //todo!!! in client, we need to use the mock window until the component is mounted
    const galleryState = window.isSSR ? this.reCreateGalleryExpensively(props, initialState) : {};

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
    //const container = Object.assign({}, this.state.container, dimensionsHelper.getGalleryDimensions());
    const galleryState = this.reCreateGalleryExpensively(this.props);
    if (Object.keys(galleryState).length > 0) {
      this.setState(galleryState, () => {
        this.handleNewGalleryStructure();
      });
    }
    // this.setState({
    //   container: Object.assign({}, this.state.container, dimensionsHelper.getGalleryDimensions())
    // }, () => {
    //   this.handleNewGalleryStructure();
    // });

  }

  componentWillReceiveProps(nextProps) {

    const reCreateGallery = () => {
      const galleryState = this.reCreateGalleryExpensively(nextProps);
      if (Object.keys(galleryState).length > 0) {
        this.setState(galleryState, () => {
          this.handleNewGalleryStructure();
        });
      }
    };

    if (this.reCreateGalleryTimer) {
      clearTimeout(this.reCreateGalleryTimer);
    }

    let hasPropsChanged = true;
    try {
      hasPropsChanged = (JSON.stringify(this.props) !== JSON.stringify(nextProps));
    } catch (e) {
      console.error('Cannot compare props', e);
    }

    if (hasPropsChanged) {
      if (utils.isVerbose()) {
        console.log('New props arrived', utils.printableObjectsDiff(this.props, nextProps));
      }

      reCreateGallery();

      if (!!nextProps.currentIdx && nextProps.currentIdx > 0) {
        this.scrollToItem(nextProps.currentIdx, false, true, 0);
      }

      if (this.props.isInDisplay !== nextProps.isInDisplay) {
        this.handleNavigation(nextProps.isInDisplay);
      }

    } else {
      //this is a hack, because in fullwidth, new props arrive without any changes
      this.reCreateGalleryTimer = setTimeout(reCreateGallery, 1000);
    }
  }

  loadItemsDimensions() {

    const preloadItem = (item, onload) => {
      if (!item || !item.itemId || !item.isGalleryItem) {
        return;
      }
      try {
        const id = item.itemId;
        if (this.itemsDimensions[id]) {
          return; //already measured
        }
        if (typeof this.preloadedItems[id] !== 'undefined') {
          return;
        }
        this.preloadedItems[id] = new Image();
        if (utils.isVerbose()) {
          console.log('Preloading item #' + item);
        }
        this.preloadedItems[id].src = item.preload_url;
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

      const {items, styles, container, watermarkData} = this.props;
      const params = {items, styles, container, watermarkData, itemsDimensions: this.itemsDimensions};

      const newState = this.reCreateGalleryExpensively(params, this.state);
      if (Object.keys(newState).length > 0) {
        this.setState(newState, () => {
          this.handleNewGalleryStructure();
        });
      }
    }, 2500);

    if (!(this.galleryStructure && this.galleryStructure.galleryItems && this.galleryStructure.galleryItems.length > 0)) {
      return;
    }

    const {galleryItems} = this.galleryStructure;

    const itemsWithoutDimensions = galleryItems.filter((item, idx) => {
      try {
        return (item.isVisible && item.isDimensionless && !item.isPreloaded);
      } catch (e) {
        return false;
      }
    });

    itemsWithoutDimensions.forEach((item, idx, items) => {
      item.isPreloaded = true;
      preloadItem(item, e => {
        try {
          if (utils.isVerbose()) {
            console.log('item loaded event', idx, e);
          }
          const ele = e.srcElement;
          const _item = this.items.find(itm => itm.itemId === item.itemId);
          if (_item) {
            const itemDim = {
              width: ele.width,
              height: ele.height,
              measured: true
            };

            Object.assign(_item, itemDim);
            if (typeof _item.metaData === 'object') {
              Object.assign(_item.metaData, itemDim);
            }
            this.itemsDimensions[_item.itemId] = itemDim;

            //rebuild the gallery after every dimension update
            // if (Object.keys(this.itemsDimensions).length > 0) {
            throttledReCreateGallery();
            // }

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
      const {container} = this.state;
      const partialStyleParams = _.pick(this.state.styles,
        ['isSlideshow',
          'slideshowInfoSize',
          'galleryThumbnailsAlignment',
          'thumbnailSize',
          'isSlider',
          'galleryWidth',
          'isInAdi',
          'oneRow',
          'enableInfiniteScroll']);
      const numOfItems = this.state.items.length;
      const layoutHeight = this.layout.height;
      const isInfinite = this.containerGrowthDirection() === 'vertical';
      this.props.handleNewGalleryStructure({numOfItems, container, partialStyleParams, layoutHeight, isInfinite});
    }
  }

  isNew({items, styles, container, watermarkData, itemsDimensions}, state) {

    const reason = {
      items: '',
      itemsMetadata: '',
      itemsAdded: '',
      styles: '',
      container: '',
    };

    const containerHadChanged = container => {
      if (!state.styles || !state.container) {
        reason.container = 'no old container or styles. ';
        return true; //no old container or styles (style may change container)
      }
      if (!container) {
        reason.container = 'no new container.';
        return false; // no new continainer
      }
      const containerHasChanged = {
        height: !state.styles.oneRow && state.styles.enableInfiniteScroll ? false : (!!container.height && (container.height !== this.props.container.height)),
        width: dimensionsHelper.isFullWidth(container) || (!!container.width && (container.width !== this.props.container.width)),
        scrollBase: !!container.scrollBase && (container.scrollBase !== this.props.container.scrollBase),
      };
      return Object.keys(containerHasChanged).reduce((is, key) => {
        if (containerHasChanged[key]) {
          reason.container += `container.${key} has changed. `;
        }
        return is || containerHasChanged[key];
      }, false);
    };

    const stylesHaveChanged = styles => {
      if (!styles) {
        reason.styles = 'no new styles.';
        return false; //no new styles - use old styles
      }
      if (!state.styles) {
        reason.styles = 'no old styles.';
        return true; //no old styles
      }
      try {
        const wasChanged = (JSON.stringify(styles) !== JSON.stringify(this.props.styles));
        if (wasChanged) {
          reason.styles = 'styles were changed.';
        }
        return wasChanged;
      } catch (e) {
        console.error('Could not compare styles', e);
        return false;
      }
    };

    const itemsWereAdded = items => {
      const existingItems = this.items;
      if (items === this.items) {
        reason.itemsAdded = 'items are the same object.';
        return false; //it is the exact same object
      }
      if (!items) {
        reason.itemsAdded = 'new items do not exist.';
        return false; // new items do not exist (use old items)
      }
      if (!state.items || !existingItems) {
        reason.itemsAdded = 'old items do not exist.';
        return false; // old items do not exist (it is not items addition)
      }
      if (existingItems.length >= items.length) {
        reason.itemsAdded = 'more old items than new items.';
        return false; // more old items than new items
      }
      const idsNotChanged = existingItems.reduce((is, _item, idx) => {
        //check that all the existing items exist in the new array
        return is && _item.id === items[idx].itemId;
      }, true);

      if (!idsNotChanged) {
        reason.itemsAdded = 'items ids were changed. ';
      }
      return idsNotChanged;
    };

    const itemsHaveChanged = newItems => {
      const existingItems = this.items;
      if (newItems === this.items) {
        reason.items = 'items are the same object.';
        return false; //it is the exact same object
      }
      if (!newItems) {
        reason.items = 'new items do not exist.';
        return false; // new items do not exist (use old items)
      }
      if (!state.items || !existingItems) {
        reason.items = 'old items do not exist.';
        return true; // old items do not exist
      }
      if (existingItems.length !== newItems.length) {
        reason.items = 'more new items than old items (or vice versa).';
        return true; // more new items than old items (or vice versa)
      }
      return newItems.reduce((is, newItem, idx) => {
        //check that all the items are identical
        const existingItem = existingItems[idx];
        try {
          const itemsChanged = is || !newItem || !existingItem || newItem.itemId !== existingItem.itemId;
          if (itemsChanged) {
            reason.items = `items #${idx} id was changed.`;
          }
          return itemsChanged;
        } catch (e) {
          reason.items = 'an error occured';
          return true;
        }
      }, false);
    };

    const itemsMetadataWasChanged = newItems => {
      const existingItems = this.items;

      if (!newItems) {
        reason.itemsMetadata = 'new items do not exist.';
        return false; // new items do not exist (use old items)
      }
      if (!state.items || !existingItems) {
        reason.itemsMetadata = 'old items do not exist.';
        return true; // old items do not exist
      }

      return newItems.reduce((is, newItem, idx) => {
        //check that all the items are identical
        const existingItem = existingItems[idx];
        try {
          const itemsChanged = is || JSON.stringify(newItem.metaData) !== JSON.stringify(existingItem.metaData);
          if (itemsChanged) {
            reason.itemsMetadata = `item #${idx} data was changed.`;
          }
          return itemsChanged;
        } catch (e) {
          reason.itemsMetadata = 'an error occured.';
          return true;
        }
      }, false);

    };

    const isNew = {
      items: itemsHaveChanged(items),
      addedItems: itemsWereAdded(items),
      itemsMetadata: itemsMetadataWasChanged(items),
      styles: stylesHaveChanged(styles),
      container: containerHadChanged(container),
      itemsDimensions: !!itemsDimensions,
      watermark: !!watermarkData && (watermarkData !== this.props.watermarkData),
    };

    isNew.str = Object.entries(isNew).map(([key, is]) => is ? key : '').filter(str => !!str).join('|');
    isNew.any = isNew.str.length > 0;
    isNew.reason = reason;

    // if (!isNew.any) {
    //   console.count('Tried recreating gallery with no new params');
    // } else {
    //   console.count('Recreating gallery with new params');
    // }

    return isNew;
  }

  reCreateGalleryExpensively({items, styles, container, watermarkData, itemsDimensions}, curState) {

    if (utils.isVerbose()) {
      console.count('PROGALLERY [COUNT] reCreateGalleryExpensively');
    }

    const state = curState || this.state || {};
    const isFullwidth = dimensionsHelper.isFullWidth(container); //keep this on top, before the container is recalculated

    let _styles, _container;

    const isNew = this.isNew({items, styles, container, watermarkData, itemsDimensions}, state);
    const newState = {};

    if (utils.isVerbose()) {
      console.log('PROGALLERY reCreateGalleryExpensively', isNew, {items, styles, container, watermarkData});
    }

    if ((isNew.itemsDimensions || isNew.itemsMetadata) && !isNew.items && !isNew.addedItems) {
      //if only the items metadata has changed - use the modified items (probably with the measured width and height)
      this.items = this.items.map(item => Object.assign(item, {...this.itemsDimensions[item.itemId]}));
      newState.items = this.items.map(item => item.itemId);
    } else if (isNew.items && !isNew.addedItems) {
      this.items = items.map(item => Object.assign(ItemsHelper.convertDtoToLayoutItem(item), {...this.itemsDimensions[item.itemId]}));
      newState.items = this.items.map(item => item.itemId);
      this.gettingMoreItems = false; //probably finished getting more items
    } else if (isNew.addedItems) {
      this.items = this.items.concat(items.slice(this.items.length).map(item => {
        return ItemsHelper.convertDtoToLayoutItem(item);
      }));
      newState.items = this.items.map(item => item.itemId);
      this.gettingMoreItems = false; //probably finished getting more items
    }

    if (isNew.styles || isNew.container) {
      styles = styles || state.styles;
      container = container || state.container;

      dimensionsHelper.updateParams({styles, container, domId: this.props.domId});
      _styles = addLayoutStyles(styles, container);
      dimensionsHelper.updateParams({styles: _styles});
      _container = Object.assign({}, container, dimensionsHelper.getGalleryDimensions(container));
      dimensionsHelper.updateParams({container: _container});
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
        items: this.items,
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

      if (isNew.items) {
        this.loadItemsDimensions();
      }

      if (window.isSSR && isFullwidth) {
        if (utils.isVerbose()) {
          console.time('fullwidthLayoutsCss!');
        }
        this.fullwidthLayoutsCss = createCssLayouts(layoutParams, utils.isMobile());
        if (utils.isVerbose()) {
          console.timeEnd('fullwidthLayoutsCss!');
        }
      } else {
        this.fullwidthLayoutsCss = [];
      }

      this.scrollCss = cssScrollHelper.calcScrollCss({
        galleryDomId: this.props.domId,
        items: this.galleryStructure.galleryItems,
        styleParams: _styles,
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
      top: 0,
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
    if (
      this.galleryStructure &&
      this.galleryStructure.galleryItems &&
      this.galleryStructure.galleryItems.length > 0 &&
      !this.gettingMoreItems &&
      (typeof this.props.getMoreItems === 'function') &&
      this.props.totalItemsCount > this.state.items.length
    ) { //more items can be fetched from the server
      //TODO - add support for horizontal galleries
      const {oneRow} = this.state.styles;

      const [lastItem] = this.galleryStructure.galleryItems.slice(-1);
      const gallerySize = lastItem.offset[(oneRow ? 'right' : 'bottom')];
      const screenSize = (oneRow ? window.screen.width : window.screen.height);
      const scrollEnd = scrollPos + screenSize + (oneRow ? 0 : this.state.container.scrollBase);
      const getItemsDistance = 2 * screenSize;

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
      <div data-key="pro-gallery-inner-container" key="pro-gallery-inner-container">
        <CssScrollIndicator
          galleryDomId={this.props.domId}
          oneRow={this.state.styles.oneRow}
          scrollBase={this.state.container.scrollBase}
          scrollingElement={this._scrollingElement}
          getMoreItemsIfNeeded={this.getMoreItemsIfNeeded}
        />
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
        <style data-key="scrollCss" key="scrollCss">{this.scrollCss}</style>
        {this.fullwidthLayoutsCss.map((css, idx) => <style data-key={`cssLayout-${idx}`} key={`cssLayout-${idx}`}>{css}</style>)}
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
