
import utils from '../../utils';
import React from 'react';
import GroupView from '../group/groupView.js';
import GalleryEmpty from './galleryEmpty.js';
import {Layouter} from 'pro-gallery-layouter';
import GalleryDebugMessage from './galleryDebugMessage.js';
import {appPartiallyLoaded} from 'photography-client-lib/dist/src/utils/performanceUtils';
import _ from 'lodash';

utils.fixViewport('Gallery');

class SlideshowView extends React.Component {

  constructor(props) {
    super(props);

    this.scrollToThumbnail = this.scrollToThumbnail.bind(this);
    this.stopAutoSlideshow = this.stopAutoSlideshow.bind(this);
    this.startAutoSlideshowIfNeeded = this.startAutoSlideshowIfNeeded.bind(this);
    this.handleKeypress = this.handleKeypress.bind(this);
    this.createEmptyState = this.createEmptyState.bind(this);
    this._setCurrentItemByScroll = _.throttle(this.setCurrentItemByScroll, 600, {leading: false, trailing: true}).bind(this);
    this._nextItem = _.throttle(this.nextItem, 400, {leading: true, trailing: false}).bind(this);
    this.state = {
      flatItems: [],
      currentIdx: 0,
      isInView: true,
    };
    if (!utils.isLocal()) {
      appPartiallyLoaded('pro-gallery-statics');
    }
  }

  isFirstItem() {
    return (this.state.currentIdx === 0) || (this.props.scroll.top === 0);
  }

  isLastItem() {
    const [lastGroup] = this.props.galleryStructure.groups.slice(-1);
    return (this.state.currentIdx >= this.props.totalItemsCount - 1) || !lastGroup || (this.props.container.galleryWidth + this.props.scroll.top >= lastGroup.right);
  }

  nextItem(direction, isAutoTrigger, scrollDuration = 400) {
    const currentIdx = this.setCurrentItemByScroll() || this.state.currentIdx;
    const {scrollToItem} = this.props.actions;
    let nextItem = currentIdx + direction;
    if (isAutoTrigger) {
			// ---- Called by the Auto Slideshow ---- //
      if (this.isLastItem()) {
        nextItem = 0;
        scrollDuration = 0;
      }
    } else {
		// ---- Called by the user (arrows, keys etc.) ---- //
      this.startAutoSlideshowIfNeeded(this.props.styleParams);
      const isScrollingPastEdge = ((direction === 1 && this.isLastItem()) || (direction === -1 && this.isFirstItem()));
      if (isScrollingPastEdge) {
        return;
      }
    }
		// ---- navigate ---- //
    try {
      scrollToItem(nextItem, false, true, scrollDuration);
    } catch (e) {
      console.error('Cannot proceed to the next Item', e);
      this.stopAutoSlideshow();
      return;
    }
    this.isAutoScrolling = true;
    utils.setStateAndLog(this, 'Next Item', {
      currentIdx: nextItem
    });
  }

  stopAutoSlideshow() {
    clearInterval(this.autoSlideshowInterval);
  }

  startAutoSlideshowIfNeeded(styleParams) {
    const {isAutoSlideshow, autoSlideshowInterval, galleryLayout} = styleParams;
    this.stopAutoSlideshow();
    if (!(galleryLayout === 5 || galleryLayout === 4 || galleryLayout === 3)) return;
    if (!(isAutoSlideshow && autoSlideshowInterval > 0 && this.state.isInView)) return;
    this.autoSlideshowInterval = setInterval(() => {
      this._nextItem(1, true, 800);
    }, autoSlideshowInterval * 1000);
  }

  scrollToThumbnail(itemIdx, scrollDuration = 400) { //not to confuse with this.props.actions.scrollToItem. this is used to replace it only for thumbnail items
    this.isAutoScrolling = true;
    this.startAutoSlideshowIfNeeded(this.props.styleParams);

    itemIdx += this.firstItemIdx;

    utils.setStateAndLog(this, 'Scroll to Item', {
      currentIdx: itemIdx
    });

    this.props.actions.scrollToItem(itemIdx, false, true, scrollDuration);
  }

  handleKeypress(e) {
    if (!utils.isInWix()) {
      return;
    }
    switch (e.charCode || e.keyCode) {
      case 38: //up
      case 37: //left
      case 33: //page up
        e.preventDefault();
        this._nextItem(-1);
        return false;
      case 39: //right
      case 40: //down
      case 32: //space
      case 34: //page down
        e.preventDefault();
        this._nextItem(1);
        return false;
    }
    return true; //continue handling the original keyboard event
  }

  createThumbnails(thumbnailPosition) {
    const currentIdx = this.state.currentIdx; // zero based (3)
    utils.isVerbose() && console.log('creating thumbnails for idx', currentIdx);

    let width = this.props.thumbnailSize;
    let height = this.props.thumbnailSize;

    let oneRow;
    let numOfThumbnails;
    let numOfWholeThumbnails;

    switch (thumbnailPosition) {
      case 'top':
      case 'bottom':
        width = this.props.container.galleryWidth + this.props.styleParams.thumbnailSpacings;
        height = this.props.thumbnailSize + this.props.styleParams.thumbnailSpacings;
        oneRow = true;
        numOfThumbnails = Math.ceil(width / this.props.thumbnailSize);
        numOfWholeThumbnails = Math.floor((width + this.props.styleParams.thumbnailSpacings) / (this.props.thumbnailSize + this.props.styleParams.thumbnailSpacings * 2));
        break;
      case 'left':
      case 'right':
        height = this.props.container.galleryHeight + 2 * this.props.styleParams.thumbnailSpacings;
        width = this.props.thumbnailSize + 2 * this.props.styleParams.thumbnailSpacings;
        oneRow = false;
        numOfThumbnails = Math.ceil(height / this.props.thumbnailSize);
        numOfWholeThumbnails = Math.floor(height / (this.props.thumbnailSize + this.props.styleParams.thumbnailSpacings * 2));
        break;
    }

    this.firstItemIdx = currentIdx - Math.floor(numOfThumbnails / 2);
    this.lastItemIdx = this.firstItemIdx + numOfThumbnails - 1;

    if (this.firstItemIdx < 0) {
      this.lastItemIdx -= this.firstItemIdx;
      this.firstItemIdx = 0;
    }

    if (this.lastItemIdx > this.props.items.length - 1) {
      this.firstItemIdx -= (this.lastItemIdx - (this.props.items.length - 1));
      if (this.firstItemIdx < 0) {
        this.firstItemIdx = 0;
      }
      this.lastItemIdx = this.props.items.length - 1;
    }

    numOfThumbnails = this.lastItemIdx - this.firstItemIdx + 1;
    if (numOfThumbnails % 2 === 0 && this.props.items.length > numOfThumbnails && this.lastItemIdx < this.props.items.length - 1) { // keep an odd number of thumbnails if there are more thumbnails than items and if the thumbnails haven't reach the last item yet
      numOfThumbnails += 1;
      this.lastItemIdx += 1;
    }

    const thumbnailsContainerSize = numOfThumbnails * this.props.thumbnailSize +
      ((numOfThumbnails - 1) * 2 + 1) * this.props.styleParams.thumbnailSpacings;
    const thumbnailsStyle = {width, height};

    if ((this.props.items.length <= numOfWholeThumbnails) || (currentIdx < ((numOfThumbnails / 2) - 1))) { //there are less thumbnails than available thumbnails spots || one of the first thumbnails
      switch (thumbnailPosition) {
        case 'top':
        case 'bottom':
          thumbnailsStyle.width = thumbnailsContainerSize + 'px';
          thumbnailsStyle.left = 0;
          break;
        case 'left':
        case 'right':
          thumbnailsStyle.height = thumbnailsContainerSize + 'px';
          thumbnailsStyle.marginTop = 0;
          break;
      }
    } else if ((currentIdx > ((numOfThumbnails / 2) - 1)) && (currentIdx < (this.props.items.length - (numOfThumbnails / 2)))) { //set selected to center only if neeeded
      switch (thumbnailPosition) {
        case 'top':
        case 'bottom':
          thumbnailsStyle.width = thumbnailsContainerSize + 'px';
          thumbnailsStyle.left = ((width - thumbnailsContainerSize) / 2) + 'px';
          break;
        case 'left':
        case 'right':
          thumbnailsStyle.height = thumbnailsContainerSize + 'px';
          thumbnailsStyle.marginTop = ((height - thumbnailsContainerSize) / 2) + 'px';
          break;
      }
    } else if (currentIdx >= (this.props.items.length - (numOfThumbnails / 2))) { //one of the last thumbnails
      switch (thumbnailPosition) {
        case 'top':
        case 'bottom':
          thumbnailsStyle.left = (width - thumbnailsContainerSize) + 'px';
          thumbnailsStyle.overflow = 'visible';
          break;
        case 'left':
        case 'right':
          thumbnailsStyle.top = (height - thumbnailsContainerSize) + 'px';
          thumbnailsStyle.overflow = 'visible';
          break;
      }
    }

    const container = _.merge({}, this.props.container, {
      galleryWidth: width,
      galleryHeight: height
    });

    const thumbnailsLayout = this.props.convertToGalleryItems(new Layouter({
      items: this.props.items.slice(this.firstItemIdx, this.lastItemIdx + 1).map(item => this.props.convertDtoToLayoutItem(item)),
      container,
      watermark: this.props.watermark,
      styleParams: {
        gotStyleParams: false,
        isVertical: false,
        gallerySize: this.props.thumbnailSize,
        minItemSize: this.props.thumbnailSize,
        imageMargin: this.props.styleParams.thumbnailSpacings,
        galleryMargin: 0,
        groupSize: 1,
        chooseBestGroup: false,
        groupTypes: '1',
        cubeImages: true,
        smartCrop: false,
        collageAmount: 0,
        collageDensity: 0,
        cubeRatio: 1,
        fixedColumns: 0,
        oneRow
      },
      gotScrollEvent: true,
      showAllItems: true
    }), {watermark: this.props.watermark});

    const thumbnailsConfig = {
      scroll: _.merge({}, this.props.scroll || {}),
      thumbnailHighlightId: _.get(this, `props.items.${currentIdx}.itemId`),
      watermark: this.props.watermark,
      container,
      styleParams: _.merge({}, this.props.styleParams, {
        allowHover: false,
        allowSocial: false,
        allowDownload: false,
        allowTitle: false,
        allowMultishare: false,
        loveButton: false,
        loveCounter: false,
        videoLoop: false,
        videoSpeed: 1,
        videoPlay: 'onClick',
        sharpParams: {
          quality: 90,
          usm: {}
        },
        imageMargin: this.props.styleParams.thumbnailSpacings,
        galleryMargin: 0,
        enableInfiniteScroll: 0,
        showArrows: false,
        itemClick: 'expand'
      }),
      actions: {
        scrollToItem: this.scrollToThumbnail,
        toggleFullscreen: this.props.actions.toggleFullscreen,
      },
      hidePlay: true
    };

    let thumbnailsMargin;
    const m = this.props.styleParams.thumbnailSpacings;
    switch (this.props.styleParams.galleryThumbnailsAlignment) {
      case 'bottom':
        thumbnailsMargin = `${m}px -${m}px 0 -${m}px`;
        break;
      case 'left':
        thumbnailsMargin = `-${m}px ${m}px -${m}px 0`;
        break;
      case 'top':
        thumbnailsMargin = `0 -${m}px ${m}px -${m}px`;
        break;
      case 'right':
        thumbnailsMargin = `-${m}px 0 -${m}px ${m}px`;
        break;
    }

    const thumbnails = (
      <div className={'pro-gallery inline-styles thumbnails-gallery ' + (oneRow ? ' one-row hide-scrollbars ' : '') + (utils.isAccessibilityEnabled() ? ' accessible ' : '')}
           style={{
             width,
             height,
             margin: thumbnailsMargin
           }}
           data-hook="gallery-thumbnails">

        {thumbnailsLayout.columns.map((column, c) => {
          return (
            <div data-hook="gallery-thumbnails-column" className="gallery-column" key={'thumbnails-column' + c}
                 style={thumbnailsStyle}>
              {column.galleryGroups.map(group => React.createElement(GroupView, _.merge(group.renderProps(thumbnailsConfig), {store: this.props.store})))}
            </div>
          );

        })}
      </div>
    );

    return thumbnails;

  }

  setFlattenItems(galleryStructure) {
    const flatItems = _.flattenDeep(galleryStructure.columns.map(column => {
      return column.galleryGroups.map(group => {
        return group.items;
      });
    }));

    this.setState({
      flatItems
    });
  }

  setCurrentItemByScroll() {

    utils.isVerbose() && console.log('Setting current Idx by scroll', this.isAutoScrolling);

    if (this.isAutoScrolling) {
      //avoid this function if the scroll was originated by us (arrows or thumbnails)
      this.isAutoScrolling = false;
      return;
    }

    const isScrolling = (this.container && this.container.getAttribute('data-scrolling')) === 'true';

    if (isScrolling) {
      this.stopAutoSlideshow();

      //while the scroll is animating, prevent the reaction to this event
      return;
    }
    this.startAutoSlideshowIfNeeded(this.props.styleParams);
    const scrollLeft = (this.container && this.container.scrollLeft) || 0;

    const items = this.state.flatItems;

    let currentIdx;
    let thumbnailColumnWidth = 0;

    if (this.props.styleParams.galleryLayout === 3) { //if layout is thumbnails
      const thumbnailPosition = this.props.styleParams.galleryThumbnailsAlignment;

      switch (thumbnailPosition) { //if thumbnailPosition is left or right, need to calculate the thumbnails column in the width calculation
        case 'left':
        case 'right':
          thumbnailColumnWidth = this.props.thumbnailSize + 2 * this.props.styleParams.thumbnailSpacings;
          break;
      }
    }

    for (let item, i = 0; item = items[i]; i++) {
      if (item.offset.left > scrollLeft + thumbnailColumnWidth + ((this.props.container.galleryWidth - item.width) / 2)) {
        currentIdx = i - 1;
        break;
      }
    }

    if (!_.isUndefined(currentIdx)) {
      utils.setStateAndLog(this, 'Set Current Item', {
        currentIdx
      });
    }
    return (currentIdx);
  }

  createDebugMsg() {
    return <GalleryDebugMessage {...this.props.debug} />;
  }


  createNavArrows() {
    const shouldNotRenderNavArrows = this.props.galleryStructure.columns.some(column => {
      const allRenderedGroups = _.filter(column.groups, group => group.rendered) || [];
      const allGroupsWidth = allRenderedGroups.reduce((sum, group) => sum + Math.max(0, group.width), 0);
      const isAllItemsFitsGalleryWidth = this.props.styleParams.oneRow && (this.props.container.galleryWidth >= allGroupsWidth);
      return isAllItemsFitsGalleryWidth;
    });

    //remove navBars if no scroll is needed and is column layout
    if (shouldNotRenderNavArrows) {
      return null;
    }

    const arrowWidth = this.props.styleParams.arrowsSize;

    const arrowOrigWidth = 23; //arrow-right svg and arrow-left svg width
    const scalePercentage = arrowWidth / arrowOrigWidth;
    const imageStyle = {transform: `scale(${scalePercentage})`};

    // nav-arrows-container width is 100. arrowWidth + padding on each side should be 100
    const containerPadding = (100 - arrowWidth) / 2;
    const slideshowSpace = this.props.styleParams.isSlideshow ? this.props.styleParams.slideshowInfoSize : 0;
    // top: this.props.styleParams.imageMargin effect the margin of the main div that SlideshowView is rendering, so the arrows should be places accordingly. 50% is the middle, 50px is half of nav-arrows-container height
    const containerStyle = {
      padding: `0 ${containerPadding}px 0 ${containerPadding}px`,
      top: `calc(50% - 50px + ${this.props.styleParams.imageMargin / 2}px - ${slideshowSpace / 2}px)`
    }
    // left & right: this.props.styleParams.imageMargin effect the margin of the main div that SlideshowView is rendering, so the arrows should be places accordingly
    const prevContainerStyle = {
      left: `${this.props.styleParams.imageMargin}px`
    };
    const nextContainerStyle = {
      right: `${this.props.styleParams.imageMargin}px`
    };

    return [
      (this.isFirstItem() ? '' : <button
        className={'nav-arrows-container prev '}
        onClick={() => this._nextItem(-1)}
        aria-label="Previous Item"
        tabIndex={utils.getTabIndex('slideshowPrev')}
        key="nav-arrow-back"
        data-hook="nav-arrow-back"
        style={{...containerStyle, ...prevContainerStyle}}
      >
        <svg width="23" height="39" viewBox="0 0 23 39" style={imageStyle}>
          <path id="_250_middle_right_copy_3" data-name="250 middle right  copy 3" className="slideshow-arrow"
                d="M154.994,259.522L153.477,261l-18.471-18,18.473-18,1.519,1.48L138.044,243Z"
                transform="translate(-133 -225)"/>
        </svg>

      </button>),
      (this.isLastItem() ? '' : <button
        className={'nav-arrows-container next'}
        onClick={() => this._nextItem(1)}
        aria-label="Next Item"
        tabIndex={utils.getTabIndex('slideshowNext')}
        key="nav-arrow-next"
        data-hook="nav-arrow-next"
        style={{...containerStyle, ...nextContainerStyle}}
      >
        <svg width="23" height="39" viewBox="0 0 23 39" style={imageStyle}>
          <path id="_250_middle_right_copy_2" data-name="250 middle right  copy 2" className="slideshow-arrow"
                d="M857.005,231.479L858.5,230l18.124,18-18.127,18-1.49-1.48L873.638,248Z"
                transform="translate(-855 -230)"/>
        </svg>
      </button>)
    ];
  }

  createLayout() {
    const galleryConfig = {
      renderedItemsCount: this.props.renderedItemsCount,
      scroll: this.props.scroll,
      styleParams: this.props.styleParams,
      container: this.props.container,
      multishare: this.props.multishare,
      watermark: this.props.watermark,
      settings: this.props.settings,
      currentIdx: this.state.currentIdx,
      actions: {
        getMoreItemsIfNeeded: this.props.actions.getMoreItemsIfNeeded,
        toggleFullscreen: this.props.actions.toggleFullscreen,
        addItemToMultishare: this.props.actions.addItemToMultishare,
        removeItemFromMultishare: this.props.actions.removeItemFromMultishare
      }
    };

    return this.props.galleryStructure.columns.map((column, c) => {

      let marginLeft = 0;
      const firstGroup = _.find(column.groups, group => group.rendered) || {};
      if (this.props.gotScrollEvent) {
        marginLeft = firstGroup.left || 0;
      }

      return !!column.galleryGroups.length && (
        <div data-hook="gallery-column" id="gallery-horizontal-scroll" className="gallery-horizontal-scroll gallery-column hide-scrollbars" key={'column' + c}
             style={{width: column.width}}>
          <div className="gallery-left-padding" style={{width: marginLeft}}></div>
          {column.galleryGroups.map(group => group.rendered ? React.createElement(GroupView, _.merge(group.renderProps(galleryConfig), {store: this.props.store})) : false)}
        </div>
      );
    });
  }

  createGallery() {
    const galleryStyle = {
      height: this.props.container.galleryHeight,
      width: this.props.container.galleryWidth
    };

    return <div id="pro-gallery-container" className={'pro-gallery inline-styles one-row hide-scrollbars ' + (this.props.styleParams.enableScroll ? ' slider ' : '') + (utils.isAccessibilityEnabled() ? ' accessible ' : '')}
                style={galleryStyle}
    >
      {this.createEmptyState()}
      {this.createDebugMsg()}
      {this.createLayout()}
      {this.createNavArrows()}
    </div>;
  }

  getThumbnails() {
    const hasThumbnails = this.props.styleParams.hasThumbnails;
    const thumbnailsPosition = this.props.styleParams.galleryThumbnailsAlignment;

    const thumbnailsGallery = hasThumbnails ? this.createThumbnails(thumbnailsPosition) : false;

    const thumbnails = [];
    switch (thumbnailsPosition) {
      case 'top':
      case 'left':
        thumbnails[0] = thumbnailsGallery;
        thumbnails[1] = false;
        break;
      case 'right':
      case 'bottom':
        thumbnails[0] = false;
        thumbnails[1] = thumbnailsGallery;
        break;
    }
    return thumbnails;
  }

  getClassNames() {
    let classNames = '';
    if (this.props.styleParams.isSlideshow) {
      classNames = ' gallery-slideshow';
    } else if (this.props.styleParams.isSlider) {
      classNames = ' gallery-slider';
    } else if (this.props.styleParams.hasThumbnails) {
      classNames = ' gallery-thumbnails';
    } else if (this.props.styleParams.isColumns) {
      classNames = ' gallery-columns';
    }

    if (this.props.container.galleryWidth >= (utils.getWindowWidth() - 10)) {
      classNames += ' streched';
    }

    return classNames;
  }

  getStyles() {
    return {
      margin: (-1) * (this.props.styleParams.imageMargin - this.props.styleParams.galleryMargin)
    };
  }

  //-----------------------------------------| REACT |--------------------------------------------//

  componentWillReceiveProps(props) {
    if (props.items) {
      this.setFlattenItems(props.galleryStructure);
    }


    if (!utils.isSite()) {
      if (( //check that the change is related to the slideshow settings
          (this.props.styleParams.isAutoSlideshow !== props.styleParams.isAutoSlideshow) ||
          (this.props.styleParams.autoSlideshowInterval !== props.styleParams.autoSlideshowInterval)
				)) {
        this.startAutoSlideshowIfNeeded(props.styleParams);
      }
    }
  }


  createEmptyState() {
    return ((!(this.props.renderedItemsCount > 0) && utils.isEditor()) ?
    (<GalleryEmpty actions={{
      setWixHeight: this.props.actions.setWixHeight
    }}/>) : '');
  }

  componentDidMount() {
    if (this.props.galleryStructure) {
      this.setFlattenItems(this.props.galleryStructure);
    }

    window.addEventListener('keydown', this.handleKeypress);
    window.addEventListener('gallery_navigation_out', () => {
      utils.setStateAndLog(this, 'Next Item', {
        isInView: false
      });
      this.stopAutoSlideshow();
    });
    window.addEventListener('gallery_navigation_in', () => {
      utils.setStateAndLog(this, 'Next Item', {
        isInView: true
      });
      this.startAutoSlideshowIfNeeded(this.props.styleParams);
    });

    this.container = document.getElementById('gallery-horizontal-scroll');
    if (this.container) {
      this.container.addEventListener('scroll', this._setCurrentItemByScroll);
    }
    this.setCurrentItemByScroll();
    this.startAutoSlideshowIfNeeded(this.props.styleParams);

  }

  componentWillUnmount() {
    if (this.container) {
      this.container.removeEventListener('scroll', this._setCurrentItemByScroll);
    }
  }

  //-----------------------------------------| RENDER |--------------------------------------------//

  render() {
    if (utils.isDev()) {
      console.count('galleryView render');
      console.count('Rendering Gallery count');
      console.time('Rendering Gallery took ');
    }

    const gallery = this.createGallery();
    const thumbnails = this.getThumbnails();

    if (utils.isDev()) {
      console.timeEnd('Rendering Gallery took ');
    }

    return (<div className={this.getClassNames()} style={this.getStyles()}>
      {thumbnails[0]}
      {gallery}
      {thumbnails[1]}
    </div>);

  }
}

export default SlideshowView;
