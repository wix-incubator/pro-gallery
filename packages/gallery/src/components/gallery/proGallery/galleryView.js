import React from 'react';
import { window, utils } from 'pro-gallery-lib';
import GalleryDebugMessage from './galleryDebugMessage';
import itemView from '../../item/itemView.js';
import { GalleryComponent } from '../../galleryComponent';

class GalleryView extends GalleryComponent {
  constructor(props) {
    super(props);
    this.handleArrowKeys = this.handleArrowKeys.bind(this);
    this.showMoreItems = this.showMoreItems.bind(this);
    this.createGalleryConfig = this.createGalleryConfig.bind(this);
    this.screenLogs = this.screenLogs.bind(this);
    this.createGallery = this.createGallery.bind(this);

    this.id = Date.now() + '|' + Math.floor(Math.random() * 10000);

    this.state = {
      currentIdx: 0,
    };
  }

  handleArrowKeys(e) {
    const activeItemIdx = window.document.activeElement.getAttribute(
      'data-idx'
    );

    if (activeItemIdx) {
      const findNeighborItem =
        this.props.actions.findNeighborItem ||
        this.props.galleryStructure.findNeighborItem ||
        (() => {}); //temp change for tests to pass

      const idx = Number(activeItemIdx);

      let newIdx = -1;

      switch (e.keyCode || e.charCode) {
        case 38: //up
          newIdx = findNeighborItem(idx, 'up');
          break;
        case 37: //left
          newIdx = findNeighborItem(
            idx,
            this.props.styleParams.isRTL ? 'right' : 'left'
          );
          break;
        case 40: //down
          newIdx = findNeighborItem(idx, 'down');
          break;
        case 39: //right
          newIdx = findNeighborItem(
            idx,
            this.props.styleParams.isRTL ? 'left' : 'right'
          );
          break;
      }

      //if nextIdx is below the lastVisibleItemIdx (higher idx), we will ignore the findNeighborItem answer and stay on the same item
      if (newIdx > this.lastVisibleItemIdx()) {
        newIdx = idx;
      }

      if (newIdx >= 0) {
        e.preventDefault();
        e.stopPropagation();
        utils.setStateAndLog(this, 'Set Gallery Current Item', {
          currentIdx: newIdx,
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
    //the item must be visible and above the show more button
    return this.lastVisibleItemIdxInHeight(
      this.props.container.galleryHeight - 100
    );
  }
  showMoreItems() {
    if (this.props.styleParams.isAccessible) {
      // tal - I left this check since we do not want to focus the last item in non-accessibility mode
      //find the last visible item and focus on it
      try {
        const lastItemIdx = this.lastVisibleItemIdx();
        utils.setStateAndLog(
          this,
          'Focus on Last Gallery Item',
          {
            currentIdx: lastItemIdx + 1,
          },
          () => {
            this.props.actions.toggleLoadMoreItems();
          }
        );
      } catch (e) {
        console.warn('Cannot find item to focus', e);
      }
    } else {
      this.props.actions.toggleLoadMoreItems();
    }
  }

  createGallery(showMore) {
    const {
      itemsLoveData,
      styleParams,
      container,
      galleryStructure,
      getVisibleItems,
    } = this.props;
    const galleryConfig = this.createGalleryConfig();
    const showMoreContainerHeight = 138; //according to the scss
    const debugMsg = <GalleryDebugMessage {...this.props.debug} />;

    let galleryHeight;
    if (showMore) {
      galleryHeight = container.galleryHeight - showMoreContainerHeight;
    } else {
      galleryHeight = galleryStructure.height + 'px';
    }
    const galleryStructureItems = getVisibleItems(
      galleryStructure.galleryItems,
      container
    );
    const layout = galleryStructureItems.map((item, index) =>
      React.createElement(
        itemView,
        item.renderProps({
          ...galleryConfig,
          ...itemsLoveData[item.id],
          visible: item.isVisible,
          key: `itemView-${item.id}-${index}`,
        })
      )
    );

    return (
      <div
        id="pro-gallery-container"
        className={
          'pro-gallery inline-styles ' +
          (styleParams.oneRow ? ' one-row slider hide-scrollbars ' : '') +
          (styleParams.isAccessible ? ' accessible ' : '') +
          (styleParams.isRTL ? ' rtl ' : ' ltr ')
        }
        style={{
          height: galleryHeight,
          overflowX: 'hidden',
          //  width: this.props.container.galleryWidth,
        }}
        onKeyDown={this.handleArrowKeys}
      >
        <div
          id="pro-gallery-margin-container"
          style={{
            margin: styleParams.galleryMargin + 'px',
            height: galleryHeight,
            width: this.props.container.galleryWidth - styleParams.imageMargin,
            overflow: 'visible',
            position: 'relative',
          }}
        >
          {debugMsg}
          {layout}
        </div>
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
      scrollAnimationCss: this.props.scrollAnimationCss,
      currentIdx: this.state.currentIdx,
      customHoverRenderer: this.props.customHoverRenderer,
      customInfoRenderer: this.props.customInfoRenderer,
      customImageRenderer: this.props.customImageRenderer,
      domId: this.props.domId,
      gotFirstScrollEvent: this.props.gotFirstScrollEvent,
      playingVideoIdx: this.props.playingVideoIdx,
      noFollowForSEO: this.props.noFollowForSEO,
      isPrerenderMode: this.props.isPrerenderMode,
      firstUserInteractionExecuted: this.props.firstUserInteractionExecuted,
      actions: {
        eventsListener: this.props.actions.eventsListener,
      },
    };
  }

  screenLogs() {
    return utils.shouldDebug('screenLogs') ? (
      <div className="screen-logs">
        URL width: {utils.parseGetParam('width')}, Container:{' '}
        {JSON.stringify(this.props.container.galleryWidth)},
        window.document.body.clientWidth {document.body.clientWidth},
        window.innerWidth {window.innerWidth}, window.screen.width:{' '}
        {window.screen.width}
      </div>
    ) : (
      ''
    );
  }

  createShowMoreButton() {
    if (typeof this.props.customLoadMoreRenderer === 'function') {
      return (
        <div onClick={this.showMoreItems}>
          {this.props.customLoadMoreRenderer(this.props)}
        </div>
      );
    }
    const { styleParams } = this.props;
    let showMoreButton = false;
    const buttonState = this.props.displayShowMore;
    const shouldShowButton =
      buttonState &&
      this.props.galleryStructure.height > this.props.container.height;

    if (shouldShowButton) {
      const buttonText = styleParams.loadMoreButtonText || 'Load More';
      showMoreButton = (
        <div
          className={
            'show-more-container' +
            (utils.isMobile() ? ' pro-gallery-mobile-indicator' : '')
          }
        >
          <button
            tabIndex={utils.getTabIndex('loadMoreButton')}
            id={'show-more-' + this.props.domId}
            className="show-more"
            onClick={this.showMoreItems}
            onMouseDown={(e) => e.preventDefault()}
            data-hook="show-more"
            aria-label={buttonText}
          >
            {buttonText}
          </button>
        </div>
      );
    }

    return showMoreButton;
  }

  //-----------------------------------------| RENDER |--------------------------------------------//

  render() {
    if (utils.isVerbose()) {
      console.count('galleryView render');
      console.time('Rendering Gallery took ');
      console.log(
        '[DEBUG_RENDER] GalleryView styleParams',
        this.props.styleParams
      );
      console.log(
        '[DEBUG_RENDER] GalleryView props changed',
        utils.printableObjectsDiff(this.lastProps || {}, this.props)
      );
      this.lastProps = { ...this.props };
      console.log(
        '[DEBUG_RENDER] GalleryView state changed',
        utils.printableObjectsDiff(this.lastState || {}, this.state)
      );
      this.lastState = { ...this.state };
      this.renderCount = (this.renderCount || 0) + 1;
    }

    const showMore = this.createShowMoreButton();
    const gallery = this.createGallery(showMore);

    if (utils.isVerbose()) {
      console.timeEnd('Rendering Gallery took ');
    }
    const screenLogs = this.screenLogs();

    return (
      <div
        className={'pro-gallery-parent-container'}
        key={`pro-gallery-${this.id}`}
        role="region"
        aria-label={this.props.proGalleryRegionLabel}
      >
        {screenLogs}
        {gallery}
        {showMore}
      </div>
    );
  }
}

export default GalleryView;
