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
import window from 'photography-client-lib/dist/src/sdk/windowWrapper';
import CssSrollIndicator from './galleryCssScrollIndicator';
import {createLayout} from 'pro-gallery-layouter';
import {cssScrollHelper} from '../helpers/cssScrollHelper.js';
import {createCssLayouts} from '../helpers/cssLayoutsHelper.js';
import _ from 'lodash';
import utils from '../../utils';

export class GalleryContainer extends React.Component {

  constructor(props) {
    super(props);
    console.count('[OOISSR] galleryContainerNew constructor', window.isMock);

    this.state = {
      pgScroll: 0,
      scroll: {
        isInfinite: this.isInfiniteScroll()
      },
      currentHover: -1
    };

    this.reCreateGalleryExpensively(props).then(newState => {
      this.state = {
        ...this.state,
        ...newState,
      };
    });

    this.getMoreItemsIfNeeded = this.getMoreItemsIfNeeded.bind(this);
    this.toggleInfiniteScroll = this.toggleInfiniteScroll.bind(this); //TODO check if needed
    this.isInfiniteScroll = this.isInfiniteScroll.bind(this); //TODO check if needed
    this.scrollToItem = this.scrollToItem.bind(this);
    this.toggleFullscreen = (typeof props.onItemClicked === 'function') ? (itemIdx => this.props.onItemClicked(this.galleryStructure.galleryItems[itemIdx])) : () => {};
    this._scrollingElement = this.getScrollingElement();
    this.setCurrentHover = this.setCurrentHover.bind(this);
  }

  componentDidMount() {
    this.reCreateGalleryExpensively(this.props).then(newState => {
      this.setState(newState, () => {
        this.getMoreItemsIfNeeded(0);
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    this.reCreateGalleryExpensively(nextProps).then(newState => {
      this.setState(newState);
    });
    if (!!nextProps.currentIdx && nextProps.currentIdx > 0) {
      this.scrollToItem(nextProps.currentIdx, false, true, 0);
    }
    if (this.props.isInDisplay !== nextProps.isInDisplay) this.handleNavigation(nextProps.isInDisplay);
  }

  handleNavigation(isInDisplay) {
    if (isInDisplay) {
      this.props.store.dispatch(actions.toggleIsInView(true));
    }	else {
      this.props.store.dispatch(actions.toggleIsInView(false));
      this.props.store.dispatch(pauseVideo());
    }
  }

  isNew({items, styles, container, watermarkData}) {

    const isInfiniteScrollChanged = () => {
      if (!this.infiniteScrollChanged && (this.state.scroll.isInfinite !== this.props.styles.enableInfiniteScroll)) {
        this.infiniteScrollChanged = true;
        return true;
      }
      return false;
    };

    const containerHadChanged = container => {
      const containerHasChanged = {
        height: !this.state.styles.oneRow ? false : (!!container.height && (container.height !== this.props.container.height)),
        width: !!container.width && (container.width !== this.props.container.width),
        scrollBase: !!container.scrollBase && (container.scrollBase !== this.props.container.scrollBase),
      };
      return Object.keys(containerHasChanged).reduce((is, key) => is || containerHasChanged[key], false);
    };

    const stylesHaveChanged = styles => {
      let is;
      try {
        is = (JSON.stringify(styles) !== JSON.stringify(this.props.styles));
      } catch (e) {
        is = true;
      }
      return is;
    };

    const isNew = {
      items: !!items && (!this.state.items || items !== this.props.items),
      styles: !!styles && (!this.state.styles || stylesHaveChanged(styles)),
      container: !this.state.styles || !this.state.container || (!!container && containerHadChanged(container)),
      watermark: !!watermarkData && (watermarkData !== this.props.watermarkData),
      scroll: isInfiniteScrollChanged(),
    };
    isNew.any = Object.keys(isNew).reduce((is, key) => is || isNew[key], false);

    return isNew;
  }

  reCreateGalleryExpensively({items, styles, container, watermarkData}) {

    if (window.isMock) {
      console.log('[OOISSR] reCreateGalleryExpensively', {items, styles, container, watermarkData});
    }
    const handleNewGalleryStructure = typeof this.props.handleNewGalleryStructure === 'function' ? this.props.handleNewGalleryStructure : () => {};

    dimentionsHelper.updateParams({styles, container});

    const isFullwidth = (container && container.width === '100%');

    let _items, _styles, _container, scroll, _scroll;
    items = items || this.items;

    const isNew = this.isNew({items, styles, container, watermarkData});
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
        scrollBase: this.getScrollBase(container),
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
      this.galleryStructure = ItemsHelper.convertToGalleryItems(layout, {
        watermark: watermarkData,
        sharpParams: _styles.sharpParams,
        lastVisibleItemIdx: this.lastVisibleItemIdx,
      });
      const isFullwidth = _container.width === '100%';
      if (isFullwidth) {
        console.time('fullwidthLayoutsCss!');
        this.fullwidthLayoutsCss = createCssLayouts(layoutParams);
        console.timeEnd('fullwidthLayoutsCss!');
      } else {
        this.fullwidthLayoutsCss = '';
      }

      this.scrollCss = cssScrollHelper.calcScrollCss({
        items: this.galleryStructure.galleryItems,
        styleParams: _styles,
        scrollBase: _container.scrollBase
      });

      handleNewGalleryStructure({items: _items, container: _container, styles: _styles, layout, isInfinite});
    }

    if (utils.isVerbose()) {
      console.log('PROGALLERY [RENDERS] - reCreateGalleryExpensively', {isNew}, {items, styles, container, watermarkData});
    }

    return new Promise((resolve, reject) => {
      if (isNew.any) {
        resolve(newState);
      } else {
        resolve(this.state);
      }
    });
  }

  getScrollBase(container) {
    container = container || this.props.container;
    let {scrollBase} = container;
    try {
      const {y} = window.document.getElementById(`pro-gallery-${this.props.domId}`).getBoundingClientRect();
      scrollBase += y;
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
      this.reCreateGalleryExpensively(this.props).then(newState => {
        this.setState(newState);
      });
    });
  }

  setCurrentHover(idx) {
    this.setState(
      {currentHover: idx}
    );
  }

  async getMoreItemsIfNeeded(scrollPos) {
    if (this.galleryStructure && this.props.onGetItems && !this.gettingMoreItems && this.props.totalItemsCount > this.state.items.length) { //more items can be fetched from the server
      //TODO - add support for horizontal galleries
      const {oneRow} = this.state.styles;

      const gallerySize = (oneRow ? this.galleryStructure.columns[0].width : this.galleryStructure.height);
      const scrollEnd = (oneRow ? scrollPos + window.screen.width : scrollPos + this.state.container.scrollBase + window.screen.height);
      const getItemsDistance = oneRow ? window.screen.width : window.screen.height;

      if (gallerySize - scrollEnd < getItemsDistance) { //only when the last item turns visible we should try getting more items
        this.gettingMoreItems = true;
        const newItems = await this.props.onGetItems(this.state.items.length);
        this.reCreateGalleryExpensively({
          items: this.items.concat(newItems.map(item => ItemsHelper.convertDtoToLayoutItem(item)) || [])
        }).then(newState => {
          this.gettingMoreItems = false;
          this.setState(newState);
        });
      }
    }
  }

  canRender() {
    const can = (
      this.state.container &&
      this.state.styles &&
      this.state.items
    );
    if (utils.isVerbose()) {
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

    return (
      <div>
        <style>{this.fullwidthLayoutsCss}</style>
        <style>{this.scrollCss}</style>
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
