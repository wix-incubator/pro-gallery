import React from 'react';
import { window, utils, GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import GalleryDebugMessage from './galleryDebugMessage';
import itemView from '../../item/itemView.js';
import { getItemsInViewportOrMarginByScrollLocation } from '../../helpers/virtualization';

class GalleryView extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeys = this.handleKeys.bind(this);
    this.showMoreItems = this.showMoreItems.bind(this);
    this.onLoadMoreButtonKeyDown = this.onLoadMoreButtonKeyDown.bind(this);
    this.onLoadMoreButtonKeyUp = this.onLoadMoreButtonKeyUp.bind(this);
    this.createGalleryConfig = this.createGalleryConfig.bind(this);
    this.screenLogs = this.screenLogs.bind(this);
    this.createGallery = this.createGallery.bind(this);

    this.id = Date.now() + '|' + Math.floor(Math.random() * 10000);

    this.state = {
      activeIndex: 0,
    };
  }

  handleKeys(e) {
    const activeItemIdx = window.document.activeElement.getAttribute('data-idx');

    if (activeItemIdx) {
      const findNeighborItem =
        this.props.actions.findNeighborItem || this.props.galleryStructure.findNeighborItem || (() => {}); //temp change for tests to pass

      const idx = Number(activeItemIdx);

      let newIdx = -1;

      switch (e.keyCode || e.charCode) {
        case 38: //up
          newIdx = findNeighborItem(idx, 'up');
          break;
        case 37: //left
          newIdx = findNeighborItem(
            idx,
            this.props.options[optionsMap.behaviourParams.gallery.layoutDirection] ===
              GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection].RIGHT_TO_LEFT
              ? 'right'
              : 'left'
          );
          break;
        case 40: //down
          newIdx = findNeighborItem(idx, 'down');
          if (this.props.totalItemsCount - 1 === newIdx && newIdx === this.state.activeIndex) {
            // If we are on the last item in the gallery and we pressed the down arrow
            // we want to move the focus to the out0fGallery element
            e.stopPropagation();
            utils.focusGalleryElement(this.props.outOfViewComponent);
            return false;
          }
          break;
        case 39: //right
          newIdx = findNeighborItem(
            idx,
            this.props.options[optionsMap.behaviourParams.gallery.layoutDirection] ===
              GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection].RIGHT_TO_LEFT
              ? 'left'
              : 'right'
          );
          break;
        case 27: //esc
          // e.stopPropagation();
          // utils.focusGalleryElement(this.props.galleryContainerRef);
          return false;
      }

      //if nextIdx is below the lastVisibleItemIdx (higher idx), we will ignore the findNeighborItem answer and stay on the same item
      if (newIdx > this.lastVisibleItemIdx()) {
        newIdx = idx;
      }

      if (newIdx >= 0) {
        e.preventDefault();
        e.stopPropagation();
        utils.setStateAndLog(this, 'Set Gallery Current Item', {
          activeIndex: newIdx,
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
    let galleryHeight = this.props.displayShowMore ? this.props.container.height : this.props.galleryStructure.height;
    //the item must be visible and above the show more button
    return this.lastVisibleItemIdxInHeight(galleryHeight - 100);
  }
  showMoreItems() {
    if (this.props.settings?.isAccessible) {
      // tal - I left this check since we do not want to focus the last item in non-accessibility mode
      //find the last visible item and focus on it
      try {
        const lastItemIdx = this.lastVisibleItemIdx();
        utils.setStateAndLog(
          this,
          'Focus on Last Gallery Item',
          {
            activeIndex: lastItemIdx + 1,
          },
          () => {
            this.props.actions.toggleLoadMoreItems();
          }
        );
      } catch (e) {
        console.warn('showMoreItems: Cannot find item to focus', e);
      }
    } else {
      this.props.actions.toggleLoadMoreItems();
    }
  }

  onLoadMoreButtonKeyDown(e) {
    switch (e.keyCode || e.charCode) {
      case 32: // space
      case 13: // enter
        e.preventDefault();
        e.stopPropagation();
        return false;
      default:
        break;
    }
  }

  onLoadMoreButtonKeyUp(e) {
    switch (e.keyCode || e.charCode) {
      case 32: // space
      case 13: // enter
        e.stopPropagation();
        utils.setStateAndLog(this, 'Set Gallery Current Item', {
          activeIndex: this.lastVisibleItemIdx(),
        });
        // this is to make sure that the focus is moved to the items first before the "load more" button disappears
        // other wise the gallery will lose focus to the body
        setTimeout(() => {
          this.props.actions.toggleLoadMoreItems();
        }, 0);
        return false;
      default:
        break;
    }
  }

  createGallery(showMore) {
    const { options, settings, container, galleryStructure, getVisibleItems, virtualizationSettings, scrollTop } =
      this.props;
    const galleryConfig = this.createGalleryConfig();
    const showMoreContainerHeight = 138; //according to the scss
    const debugMsg = <GalleryDebugMessage {...this.props.debug} />;

    let galleryHeight;
    if (showMore) {
      galleryHeight = container.galleryHeight - showMoreContainerHeight;
    } else {
      galleryHeight = galleryStructure.height + 'px';
    }
    const galleryWidth = this.props.isPrerenderMode
      ? 'auto'
      : this.props.container.galleryWidth - options[optionsMap.layoutParams.structure.itemSpacing];

    const items = getVisibleItems(galleryStructure.galleryItems, container, this.props.isPrerenderMode);
    const itemsWithVirtualizationData = getItemsInViewportOrMarginByScrollLocation({
      items,
      options,
      virtualizationSettings,
      galleryHeight: Math.min(galleryStructure.height, container.screen?.height || galleryStructure.height),
      scrollPosition: scrollTop || 0,
    });
    const layout = itemsWithVirtualizationData.map(({ item, shouldRender }, index) => {
      const itemProps = item.renderProps({
        ...galleryConfig,
        visible: item.isVisible,
        key: `itemView-${item.id}-${index}`,
      });
      return React.createElement(itemView, {
        ...itemProps,
        type: shouldRender ? itemProps.type : 'dummy',
      });
    });

    return (
      <div
        id={this.props.galleryContainerId}
        className={
          'pro-gallery inline-styles ' +
          (options[optionsMap.layoutParams.structure.scrollDirection] ===
          GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL
            ? ' one-row slider hide-scrollbars '
            : '') +
          (settings?.isAccessible ? ' accessible ' : '') +
          (options[optionsMap.behaviourParams.gallery.layoutDirection] ===
          GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection].RIGHT_TO_LEFT
            ? ' rtl '
            : ' ltr ')
        }
        style={{
          height: galleryHeight,
          overflowX: 'hidden',
          //  width: this.props.container.galleryWidth,
        }}
        onKeyDown={this.handleKeys}
      >
        <div
          id={`pro-gallery-margin-container-${this.props.id}`}
          className={'pro-gallery-margin-container'}
          style={{
            margin:
              (this.props.options.galleryMargin ||
                this.props.options[optionsMap.layoutParams.structure.gallerySpacing]) + 'px',
            height: galleryHeight,
            width: galleryWidth,
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
      options: this.props.options,
      settings: this.props.settings,
      activeIndex: this.state.activeIndex,
      customComponents: this.props.customComponents,
      galleryId: this.props.id,
      gotFirstScrollEvent: this.props.gotFirstScrollEvent,
      playingVideoIdx: this.props.playingVideoIdx,
      playing3DIdx: this.props.playing3DIdx,
      noFollowForSEO: this.props.noFollowForSEO,
      isPrerenderMode: this.props.isPrerenderMode,
      firstUserInteractionExecuted: this.props.firstUserInteractionExecuted,
      enableExperimentalFeatures: this.props.enableExperimentalFeatures,
      actions: {
        eventsListener: this.props.actions.eventsListener,
      },
    };
  }

  screenLogs() {
    return utils.shouldDebug('screenLogs') ? (
      <div className="screen-logs">
        URL width: {utils.parseGetParam('width')}, Container: {JSON.stringify(this.props.container.galleryWidth)},
        window.document.body.clientWidth {document.body.clientWidth}, window.innerWidth {window.innerWidth},
        window.screen.width: {window.screen.width}
      </div>
    ) : (
      ''
    );
  }

  createShowMoreButton() {
    if (typeof this.props.customComponents.customLoadMoreRenderer === 'function') {
      return <div onClick={this.showMoreItems}>{this.props.customComponents.customLoadMoreRenderer(this.props)}</div>;
    }
    const { options } = this.props;
    let showMoreButton = false;
    const buttonState = this.props.displayShowMore;
    const shouldShowButton = buttonState && this.props.galleryStructure.height > this.props.container.height;

    if (shouldShowButton) {
      const buttonText = options[optionsMap.behaviourParams.gallery.vertical.loadMore.text] || 'Load More';
      showMoreButton = (
        <div className={'show-more-container' + (utils.isMobile() ? ' pro-gallery-mobile-indicator' : '')}>
          <button
            tabIndex={utils.getTabIndex('loadMoreButton')}
            id={'show-more-' + this.props.id}
            className="show-more"
            onClick={this.showMoreItems}
            onMouseDown={(e) => e.preventDefault()}
            data-hook="show-more"
            aria-label={buttonText}
            onKeyDown={this.onLoadMoreButtonKeyDown}
            onKeyUp={this.onLoadMoreButtonKeyUp}
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
      console.log('[DEBUG_RENDER] GalleryView options', this.props.options);
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
        {...utils.getAriaAttributes({
          proGalleryRole: this.props.proGalleryRole,
          proGalleryRegionLabel: this.props.proGalleryRegionLabel,
        })}
      >
        {screenLogs}
        {gallery}
        {showMore}
      </div>
    );
  }
}

export default GalleryView;
/* eslint-enable prettier/prettier */
