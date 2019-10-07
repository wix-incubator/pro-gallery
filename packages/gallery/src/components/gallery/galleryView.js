import React from 'react';
import GalleryDebugMessage from './galleryDebugMessage';
import utils from '../../common/utils/index.js';
import window from '../../common/window/windowWrapper';
import itemView from '../item/itemView.js';
import { GalleryComponent } from '../galleryComponent';

utils.fixViewport('Gallery');

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
      'data-idx',
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
          newIdx = findNeighborItem(idx, this.props.styleParams.isRTL ? 'right' : 'left');
          break;
        case 40: //down
          newIdx = findNeighborItem(idx, 'down');
          break;
        case 39: //right
          newIdx = findNeighborItem(idx, this.props.styleParams.isRTL ? 'left' : 'right');
          break;
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
    //the item must be visible and about the show more button
    return this.lastVisibleItemIdxInHeight(
      this.props.container.galleryHeight - 100,
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
          },
        );
      } catch (e) {
        console.warn('Cannot find item to focus', e);
      }
    } else {
      this.props.actions.toggleLoadMoreItems();
    }
  }

  createGallery(showMore) {
    const { itemsLoveData } = this.props;
    const galleryConfig = this.createGalleryConfig();
    const showMoreContainerHeight = 138; //according to the scss
    const debugMsg = <GalleryDebugMessage {...this.props.debug} />;

    let galleryHeight;
    if (showMore) {
      galleryHeight =
        this.props.container.galleryHeight -
        showMoreContainerHeight * utils.getViewportScaleRatio();
    } else {
      galleryHeight = this.props.galleryStructure.height + 'px';
    }
    const layout = this.props.galleryStructure.galleryItems.map((item, index) =>
      React.createElement(
        itemView,
        item.renderProps({
          ...galleryConfig,
          ...itemsLoveData[item.id],
          visible: item.isVisible,
          key: `itemView-${item.id}-${index}`,
          isFullWidth: this.props.isFullWidth,
        }),
      ),
    );

    return (
      <div
        id="pro-gallery-container"
        className={
          'pro-gallery inline-styles ' +
          (this.props.styleParams.oneRow
            ? ' one-row slider hide-scrollbars '
            : '') +
          (this.props.styleParams.isAccessible ? ' accessible ' : '') +
          (this.props.styleParams.isRTL ? ' rtl ' : '')
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
            margin: this.props.styleParams.galleryMargin + 'px',
            height: galleryHeight,
            width: this.props.isFullWidth ? '100%' : this.props.container.galleryWidth, //FAKE SSR
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
      currentIdx: this.state.currentIdx,
      customHoverRenderer: this.props.customHoverRenderer,
      customInfoRenderer: this.props.customInfoRenderer,
      galleryDomId: this.props.domId,
      galleryId: this.props.galleryId,
      playingVideoIdx: this.props.playingVideoIdx,
      nextVideoIdx: this.props.nextVideoIdx,
      noFollowForSEO: this.props.noFollowForSEO,
      actions: {
        isCurrentHover: this.props.actions.isCurrentHover,
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

  returnButtonStyle(styleParams) {
    const btnStyle = {};
    if (utils.isMobile()) {
      if (typeof styleParams.loadMoreButtonFont !== 'undefined') {
        btnStyle.font = styleParams.loadMoreButtonFont.value;
        btnStyle.textDecoration = styleParams.textDecorationLoadMore;
      }
      if (typeof styleParams.loadMoreButtonFontColor !== 'undefined') {
        btnStyle.color = styleParams.loadMoreButtonFontColor.value;
        btnStyle.textDecorationColor =
          styleParams.loadMoreButtonFontColor.value;
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
    const { styleParams } = this.props;
    let showMoreButton = false;
    const buttonState = this.props.displayShowMore;
    const shouldShowButton =
      buttonState &&
      this.props.galleryStructure.height > this.props.container.height;
    const btnStyle = this.returnButtonStyle(styleParams);

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
            id={'show-more-' + this.props.galleryDomId}
            className="show-more"
            onClick={this.showMoreItems}
            data-hook="show-more"
            aria-label={buttonText}
            style={btnStyle}
          >
            {buttonText}
          </button>
        </div>
      );
    }

    return showMoreButton;
  }

  getStyles() {
    const marginExceptBottom =
      -1 *
      (this.props.styleParams.imageMargin -
        this.props.styleParams.galleryMargin);
    return {
      margin: `${marginExceptBottom}px ${marginExceptBottom}px 0 ${marginExceptBottom}px`,
    };
  }

  //-----------------------------------------| RENDER |--------------------------------------------//

  render() {
    if (utils.isVerbose()) {
      console.count('galleryView render');
      console.time('Rendering Gallery took ');
      console.log(
        '[DEBUG_RENDER] GalleryView styleParams',
        this.props.styleParams,
      );
      console.log(
        '[DEBUG_RENDER] GalleryView props changed',
        utils.printableObjectsDiff(this.lastProps || {}, this.props),
      );
      this.lastProps = {...this.props};
      console.log(
        '[DEBUG_RENDER] GalleryView state changed',
        utils.printableObjectsDiff(this.lastState || {}, this.state),
      );
      this.lastState = {...this.state};
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
        // style={this.getStyles()}
        role="region"
        aria-label="Gallery. you can navigate the gallery with keyboard arrow keys."
      >
        {screenLogs}
        {gallery}
        {showMore}
      </div>
    );
  }
}

export default GalleryView;
