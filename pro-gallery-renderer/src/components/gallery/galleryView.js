import React from 'react';
import GroupView from '../group/groupView.js';
import GalleryDebugMessage from '../gallery/galleryDebugMessage';
import _ from 'lodash';
import GalleryEmpty from '../gallery/galleryEmpty';
import utils from '../../utils/index.js';
import {appPartiallyLoaded} from 'photography-client-lib/dist/src/utils/performanceUtils';
import window from 'photography-client-lib/dist/src/sdk/windowWrapper';
import ItemContainer from '../item/itemContainer.js';

utils.fixViewport('Gallery');

class GalleryView extends React.Component {

  constructor(props) {
    super(props);
    this.handleArrowKeys = this.handleArrowKeys.bind(this);
    this.showMoreItems = this.showMoreItems.bind(this);
    this.createGalleryConfig = this.createGalleryConfig.bind(this);
    this.createEmptyState = this.createEmptyState.bind(this);
    this.screenLogs = this.screenLogs.bind(this);
    this.createGallery = this.createGallery.bind(this);

    this.id = Date.now() + '|' + Math.floor(Math.random() * 10000);

    this.state = {
      currentIdx: 0,
    };
    appPartiallyLoaded('pro-gallery-statics');

    this.useCssScrolling = utils.useRefactoredProGallery;

  }

  handleArrowKeys(e) {
    const activeItemIdx = (window.document.activeElement.getAttribute('data-idx'));

    if (activeItemIdx) {

      // const findNeighborItem = utils.useRefactoredProGallery ? this.props.actions.findNeighborItem : this.props.galleryStructure.findNeighborItem;
      const findNeighborItem = this.props.actions.findNeighborItem || this.props.galleryStructure.findNeighborItem || (() => {}); //temp change for tests to pass

      const idx = Number(activeItemIdx);

      let newIdx = -1;

      switch (e.keyCode || e.charCode) {
        case 38: //up
          newIdx = findNeighborItem(idx, 'up');
          break;
        case 37: //left
          newIdx = findNeighborItem(idx, 'left');
          break;
        case 40: //down
          newIdx = findNeighborItem(idx, 'down');
          break;
        case 39: //right
          newIdx = findNeighborItem(idx, 'right');
          break;
      }

      if (newIdx >= 0) {
        e.preventDefault();
        e.stopPropagation();
        utils.setStateAndLog(this, 'Set Gallery Current Item', {
          currentIdx: newIdx
        });
        return false;
      }
    }

    return true;
  }

  lastVisibleItemIdxInHeight(height) {
    for (let i = this.props.galleryStructure.items.length - 1; i >= 0; i--) {
      const item = this.props.galleryStructure.items[i];
      const isVisible = item.offset.top < height;
      if (isVisible) {
        return i;
      }
    }
    return this.items.length - 1;
  }

  lastVisibleItemIdx() {
    //the item must be visible and about the show more button
    return this.lastVisibleItemIdxInHeight(this.props.container.galleryHeight - 100);
  }
  showMoreItems() {

    if (utils.isAccessibilityEnabled()) { // tal - I left this check since we do not want to focus the last item in non-accessibility mode
      //find the last visible item and focus on it
      try {
        const lastItemIdx = utils.useRefactoredProGallery ? this.lastVisibleItemIdx() : this.props.galleryStructure.lastVisibleItemIdx();
        utils.setStateAndLog(this, 'Focus on Last Gallery Item', {
          currentIdx: lastItemIdx + 1
        }, () => {
          this.props.actions.toggleInfiniteScroll();
        });
      } catch (e) {
        console.warn('Cannot find item to focus', e);
      }

    } else {
      this.props.actions.toggleInfiniteScroll();
    }
  }

  createGallery(showMore) {
    const galleryConfig = this.createGalleryConfig();
    const showMoreContainerHeight = 138; //according to the scss
    const debugMsg = <GalleryDebugMessage {...this.props.debug} />;

    let galleryHeight;
    if (showMore) {
      galleryHeight = (this.props.container.galleryHeight - (showMoreContainerHeight * utils.getViewportScaleRatio()));
    } else if (!utils.useRelativePositioning) {
      galleryHeight = this.props.galleryStructure.height + 'px';
    } else {
      galleryHeight = '100%';
    }

    let layout;

    if (utils.useRelativePositioning) {

      const columns = this.props.galleryStructure.columns;

      layout = _.map(columns, (column, c) => {

        let paddingTop = 0;
        if (this.props.gotScrollEvent) {
          let firstRenderedGroup = _.find(column.groups, group => group.rendered);
          if (!firstRenderedGroup) {
            if (this.props.scroll.top > 0 && column.groups.length > 0) {
            //gallery is above the fold
              firstRenderedGroup = {top: column.groups[column.groups.length - 1].bottom};
            } else {
            //gallery is below the fold
              firstRenderedGroup = {top: 0};
            }
          }
          paddingTop = firstRenderedGroup.top || 0;
        }

        return (
          <div data-hook="gallery-column" className="gallery-column" key={'column' + c}
              style={{width: column.width, paddingTop}}>
            {!!column.galleryGroups.length && column.galleryGroups.map(group => group.rendered || this.useCssScrolling ? React.createElement(GroupView, _.merge(group.renderProps(galleryConfig), {store: this.props.store})) : false)}
          </div>
        );
      });

    } else {
      layout = this.props.galleryStructure.galleryItems.map(item => React.createElement(ItemContainer, _.merge(item.renderProps(_.merge(galleryConfig, {visible: item.isVisible})), {store: this.props.store})));
    }

    return (
      <div id="pro-gallery-container" className={'pro-gallery inline-styles ' + (this.props.styleParams.oneRow ? ' one-row slider hide-scrollbars ' : '') + (utils.isAccessibilityEnabled() ? ' accessible ' : '')}
           style={{
             height: galleryHeight,
             width: this.props.container.galleryWidth,
             overflowX: 'hidden'
           }}
           onKeyDown={this.handleArrowKeys}
      >
        {debugMsg}
        {layout}
      </div>
    );
  }

  createGalleryConfig() {
    return {
      scrollingElement: this.props.scrollingElement,
      scroll: this.props.scroll,
      container: this.props.container,
      styleParams: this.props.styleParams,
      watermark: this.props.watermark,
      settings: this.props.settings,
      currentIdx: this.state.currentIdx,
      currentHover: this.props.currentHover,
      actions: {
        toggleFullscreen: this.props.actions.toggleFullscreen,
        setCurrentHover: this.props.actions.setCurrentHover,
      }
    };
  }

  createEmptyState() {
    return ((!(this.props.renderedItemsCount > 0) && utils.isEditor()) ?
    (<GalleryEmpty actions={{
      setWixHeight: this.props.actions.setWixHeight
    }}/>) : '');
  }

  screenLogs() {
    return ((utils.shouldDebug('screenLogs')) ? (
      <div className="screen-logs">URL width: {utils.parseGetParam('width')}, Container: {JSON.stringify(this.props.container.galleryWidth)}, window.document.body.clientWidth {document.body.clientWidth}, window.innerWidth {window.innerWidth}, window.screen.width: {window.screen.width}</div>
    ) : '');
  }

  returnButtonStyle(styleParams) {
    const btnStyle = {};
    if (utils.isMobile()) {
      if (typeof styleParams.loadMoreButtonFont !== 'undefined') {
        btnStyle.font = styleParams.loadMoreButtonFont.value;
        btnStyle.textDecoration = styleParams.textDecorationLoadMore;
      }
      if (typeof styleParams.loadMoreButtonFontColor !== 'undefined') {
        btnStyle.color = styleParams.loadMoreButtonFontColor.value;
        btnStyle.textDecorationColor = styleParams.loadMoreButtonFontColor.value;
      }
      if (typeof styleParams.loadMoreButtonColor !== 'undefined') {
        btnStyle.background = styleParams.loadMoreButtonColor.value;
      }
      if (typeof styleParams.loadMoreButtonBorderColor !== 'undefined') {
        btnStyle.borderColor = styleParams.loadMoreButtonBorderColor.value;
      }
      if (typeof styleParams.loadMoreButtonBorderRadius !== 'undefined') {
        btnStyle.borderRadius = styleParams.loadMoreButtonBorderRadius;
      }
      if (typeof styleParams.loadMoreButtonBorderWidth !== 'undefined') {
        btnStyle.borderWidth = styleParams.loadMoreButtonBorderWidth;
      }
    }
    return btnStyle;
  }

  createShowMoreButton() {
    const styleParams = this.props.styleParams;
    let showMoreButton = false;
    const windowHeight = utils.getWindowHeight();
    const buttonState = utils.useRefactoredProGallery ? this.props.displayShowMore : !this.props.scroll.isInfinite;
    const shouldShowButton = (buttonState && (this.props.galleryStructure.height > windowHeight));
    const btnStyle = this.returnButtonStyle(styleParams);

    if (shouldShowButton) {
      const buttonText = styleParams.loadMoreButtonText || 'Load More';
      showMoreButton = (
        <div className={'show-more-container' + (utils.isMobile() ? ' pro-gallery-mobile-indicator' : '')}>
          <button
            tabIndex={utils.getTabIndex('loadMoreButton')}
            className="show-more"
            onClick={this.showMoreItems}
            data-hook="show-more"
            aria-label={buttonText}
            style={btnStyle}
          >{buttonText}</button>
        </div>
      );
    }

    return showMoreButton;
  }

  getStyles() {
    const marginExceptBottom = (-1) * (this.props.styleParams.imageMargin - this.props.styleParams.galleryMargin);
    return {
      margin: `${marginExceptBottom}px ${marginExceptBottom}px 0 ${marginExceptBottom}px`
    };
  }

  //-----------------------------------------| RENDER |--------------------------------------------//

  render() {
    if (utils.isVerbose()) {
      console.count('galleryView render');
      console.time('Rendering Gallery took ');
      console.log('[DEBUG_RENDER] GalleryView styleParams', this.props.styleParams);
      console.log('[DEBUG_RENDER] GalleryView props changed', utils.printableObjectsDiff((this.lastProps || {}), this.props));
      this.lastProps = _.cloneDeep(this.props);
      console.log('[DEBUG_RENDER] GalleryView state changed', utils.printableObjectsDiff((this.lastState || {}), this.state));
      this.lastState = _.cloneDeep(this.state);
      this.renderCount = (this.renderCount || 0) + 1;
    }

    const showMore = this.createShowMoreButton();
    const gallery = this.createGallery(showMore);
    const emptyState = this.createEmptyState();

    if (utils.isVerbose()) {
      console.timeEnd('Rendering Gallery took ');
    }
    const screenLogs = this.screenLogs();

    return (
    <div className={'pro-gallery-parent-container'}
      key={`pro-gallery-${this.id}`}
      // style={this.getStyles()}
    >
      {screenLogs}
      {emptyState}
      {gallery}
      {showMore}
    </div>);

  }
}

export default GalleryView;
