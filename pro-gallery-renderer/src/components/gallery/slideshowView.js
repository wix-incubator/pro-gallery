
import utils from '../../utils';
import React from 'react';
import GroupView from '../group/groupView.js';
import GalleryEmpty from './galleryEmpty.js';
import {Layouter} from 'pro-gallery-layouter';
import GalleryDebugMessage from './galleryDebugMessage.js';
import {appLoaded} from 'photography-client-lib/dist/src/utils/performanceUtils';
import _ from 'lodash';

utils.fixViewport('Gallery');

class SlideshowView extends React.Component {

  constructor(props) {
    super(props);

    this.scrollToItem = this.scrollToItem.bind(this);
    this.handleKeypress = this.handleKeypress.bind(this);
    this._setCurrentItemByScroll = _.throttle(this.setCurrentItemByScroll, 600, {leading: false, trailing: true}).bind(this);

    this.state = {
      flatItems: [],
      currentIdx: 0,
    };
    if (!utils.isLocal()) {
      appLoaded('pro-gallery-statics');
    }
  }

  isFirstItem() {
    if (!_.isUndefined(this.state.currentIdx)) {
      return this.state.currentIdx === 0;
    }

    return this.props.scroll.top === 0;

  }

  isLastItem() {

    return this.state.currentIdx >= this.props.totalItemsCount - 1;

  }

  nextItem(dir) {

    this.isAutoScrolling = true;

    const currentIdx = this.state.currentIdx;

    if (this.props.styleParams.showArrows) {
      this.props.actions.scrollToItem(currentIdx + dir, false, true);
    } else {
      this.props.actions.scrollToItem(dir, true, true);
    }

    utils.setStateAndLog(this, 'Next Item', {
      currentIdx: currentIdx + dir
    });

  }

  scrollToItem(itemIdx) {

    this.isAutoScrolling = true;

    itemIdx += this.firstItemIdx;

    utils.setStateAndLog(this, 'Scroll to Item', {
      currentIdx: itemIdx
    });

    this.props.actions.scrollToItem(itemIdx, false, true);

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
        this.nextItem(-1);
        return false;
      case 39: //right
      case 40: //down
      case 32: //space
      case 34: //page down
        e.preventDefault();
        this.nextItem(1);
        return false;
    }

    return true; //continue handling the original keyboard event

  }

  createThumbnails(thumbnailPosition) {
    const currentIdx = this.state.currentIdx; // zero based (3)
    console.log('creating thumbnails for idx', currentIdx);

    let width = this.props.thumbnailSize;
    let height = this.props.thumbnailSize;

    let oneRow;
    let numOfThumbnails;

    switch (thumbnailPosition) {
      case 'top':
      case 'bottom':
        width = this.props.container.galleryWidth + this.props.styleParams.thumbnailSpacings;//window.innerWidth / utils.getViewportScaleRatio();
        height = this.props.thumbnailSize + 2 * this.props.styleParams.thumbnailSpacings;
        oneRow = true;
        numOfThumbnails = Math.ceil(width / this.props.thumbnailSize);
        break;
      case 'left':
      case 'right':
        height = this.props.container.galleryHeight + 2 * this.props.styleParams.thumbnailSpacings;// window.innerHeight * utils.getViewportScaleRatio();
        width = this.props.thumbnailSize + 2 * this.props.styleParams.thumbnailSpacings;
        oneRow = false;
        numOfThumbnails = Math.ceil(height / this.props.thumbnailSize);
        break;
    }

    this.firstItemIdx = currentIdx - Math.floor(numOfThumbnails / 2); // (1)
    this.lastItemIdx = this.firstItemIdx + numOfThumbnails - 1; // (5)

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
    if (numOfThumbnails % 2 === 0) { // keep an odd number of thumbnails
      numOfThumbnails += 1;
      this.lastItemIdx += 1;
    }
    const thumbnailsContainerSize = numOfThumbnails * this.props.thumbnailSize;
    const thumbnailsStyle = {width, height};

    if ((currentIdx > ((numOfThumbnails / 2) - 1)) && (currentIdx < (this.props.items.length - (numOfThumbnails / 2)))) { //set selected to center only if neeeded
      switch (thumbnailPosition) {
        case 'top':
        case 'bottom':
          thumbnailsStyle.width = thumbnailsContainerSize + 'px';
          thumbnailsStyle.left = 0;
          break;
        case 'left':
        case 'right':
          thumbnailsStyle.height = thumbnailsContainerSize + 'px';
          thumbnailsStyle.marginTop = ((height - thumbnailsContainerSize) / 2) + 'px';
          break;
      }
    } else if (currentIdx < ((numOfThumbnails / 2) - 1)) { //one of the first thumbnails
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
    } else if (this.lastItemIdx > numOfThumbnails && currentIdx >= this.lastItemIdx - 3) { //scroll to the left/top if the chosen thumbnail is one of the last three
      const entireThumbnailsSize = thumbnailsContainerSize - this.props.styleParams.thumbnailSpacings;
      switch (thumbnailPosition) {
        case 'top':
        case 'bottom':
          thumbnailsStyle.left = (width - entireThumbnailsSize) + 'px';
          thumbnailsStyle.overflow = 'visible';
          break;
        case 'left':
        case 'right':
          thumbnailsStyle.top = (height - entireThumbnailsSize) + 'px';
          thumbnailsStyle.overflow = 'visible';
          break;
      }
    }

    const container = _.merge({}, this.props.container, {
      galleryWidth: width,
      galleryHeight: height
    });

    const thumbnailsLayout = this.props.convertToGalleryItems(new Layouter({
      items: this.props.items.slice(this.firstItemIdx, this.lastItemIdx + 1),
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
      scroll: _.merge({}, this.props.scroll, {}),
      thumbnailHighlightId: _.get(this, `props.items.${currentIdx}.itemId`),
      watermark: this.props.watermark,
      container,
      styleParams: _.merge({}, this.props.styleParams, {
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
        scrollToItem: this.scrollToItem,
        toggleFullscreen: this.props.actions.toggleFullscreen,
        pauseAllVideos: this.props.actions.pauseAllVideos,
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
            <div data-hook="gallery-column" className="gallery-column" key={'thumbnails-column' + c}
                 style={thumbnailsStyle}>
              {column.map(group => React.createElement(GroupView, group.renderProps(thumbnailsConfig)))}
            </div>
          );

        })}
      </div>
    );

    return thumbnails;

  }

  setFlattenItems(galleryStructure) {
    const flatItems = _.flattenDeep(galleryStructure.columns.map((column, c) => {
      return column.map((group, g) => {
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
      //while the scroll is animating, prevent the reaction to this event
      return;
    }

    const scrollLeft = (this.container && this.container.scrollLeft) || 0;

    const items = this.state.flatItems;

    let currentIdx;

    for (let item, i = 0; item = items[i]; i++) {
      if (item.offset.left > scrollLeft + ((this.props.container.galleryWidth - item.width) / 2)) {
        currentIdx = i - 1;
        break;
      }
    }

    if (!_.isUndefined(currentIdx)) {
      utils.setStateAndLog(this, 'Set Current Item', {
        currentIdx
      });
    }
  }

  componentWillReceiveProps(props) {
    if (props.items) {
      this.setFlattenItems(props.galleryStructure);
    }
  }

  componentWillMount() {

    if (!(this.props.renderedItemsCount > 0) && utils.isEditor()) {
      return (<GalleryEmpty
          actions={{
            setWixHeight: this.props.actions.setWixHeight
          }}
        />
      );
    }
  }

  componentDidMount() {
    if (this.props.galleryStructure) {
      this.setFlattenItems(this.props.galleryStructure);
    }

    window.addEventListener('keydown', this.handleKeypress);

    this.container = document.getElementById('gallery-horizontal-scroll');
    if (this.container) {
      this.container.addEventListener('scroll', this._setCurrentItemByScroll);
    }
    this.setCurrentItemByScroll();

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

      //this.gallery = this.prepareGallery(this.state.images);
      console.count('Rendering Gallery count');
      console.time('Rendering Gallery took ');
    }

    const loader = (this.totalItemsCount > this.props.renderedItemsCount) ? (
      <div className="more-items-loader"><i className="pro-circle-preloader"/></div>
    ) : false;

    let navArrows = [
      (this.isFirstItem() ? '' : <button
        className={'nav-arrows-container prev '}
        onClick={() => this.nextItem(-1)}
        aria-label="Previous Item"
        tabIndex={utils.getTabIndex('slideshowPrev')}
        key="nav-arrow-back"
        data-hook="nav-arrow-back"
      >
        <img src={require(`../../assets/images/arrows/arrow-left.svg`)} />
      </button>),
      (this.isLastItem() ? '' : <button
        className={'nav-arrows-container next'}
        onClick={() => this.nextItem(1)}
        aria-label="Next Item"
        tabIndex={utils.getTabIndex('slideshowNext')}
        key="nav-arrow-next"
        data-hook="nav-arrow-next"
      >
        <img src={require(`../../assets/images/arrows/arrow-right.svg`)} />
      </button>)
    ];

    const debugMsg = (
      <GalleryDebugMessage {...this.props.debug} />
    );

    const galleryConfig = {
      scroll: this.props.scroll,
      styleParams: this.props.styleParams,
      container: this.props.container,
      multishare: this.props.multishare,
      watermark: this.props.watermark,
      settings: this.props.settings,
      currentIdx: this.state.currentIdx,
      actions: {
        toggleFullscreen: this.props.actions.toggleFullscreen,
        pauseAllVideos: this.props.actions.pauseAllVideos,
        addItemToMultishare: this.props.actions.addItemToMultishare,
        removeItemFromMultishare: this.props.actions.removeItemFromMultishare
      }
    };

    const layout = (
      this.props.galleryStructure.columns.map((column, c) => {

        let marginLeft = 0;
        const firstGroup = _.find(column, group => group.rendered) || {};
        if (this.props.gotScrollEvent) {
          marginLeft = firstGroup.left || 0;
        }

        //remove navBars if no scroll is needed and is column layout
        const allRenderedGroups = _.filter(column, group => group.rendered) || [];
        const allGroupsWidth = allRenderedGroups.reduce((sum, group) => {
          return sum + group.width;
        }, 0);
        const isAllItemsFitsGalleryWidth = this.props.styleParams.oneRow && (this.props.container.galleryWidth >= allGroupsWidth);
        if (isAllItemsFitsGalleryWidth) {
          navArrows = false;
        }

        return (
          <div data-hook="gallery-column" id="gallery-horizontal-scroll" className="gallery-horizontal-scroll gallery-column hide-scrollbars" key={'column' + c}
               style={{width: this.props.galleryStructure.colWidth}}>
            <div className="gallery-left-padding" style={{width: marginLeft}}></div>
            {column.map(group => group.rendered ? React.createElement(GroupView, _.merge(group.renderProps(galleryConfig), {store: this.props.store})) : false)}
          </div>
        );

      })
    );

    const hasThumbnails = this.props.styleParams.hasThumbnails;
    const thumbnailsPosition = this.props.styleParams.galleryThumbnailsAlignment;

    const thumbnailsGallery = hasThumbnails ? this.createThumbnails(thumbnailsPosition) : false;

    const galleryStyle = {
      height: this.props.container.galleryHeight,
      width: this.props.container.galleryWidth
    };

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

    const gallery = (
      <div id="pro-gallery-container" className={'pro-gallery inline-styles one-row hide-scrollbars ' + (this.props.styleParams.enableScroll ? ' slider ' : '') + (utils.isAccessibilityEnabled() ? ' accessible ' : '')}
           style={galleryStyle}
      >
        {debugMsg}
        {layout}
        {loader}
        {navArrows}
      </div>
    );

    if (utils.isDev()) {
      console.timeEnd('Rendering Gallery took ');
    }

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

    const styles = {
      margin: (-1) * (this.props.styleParams.imageMargin - this.props.styleParams.galleryMargin)
    };

    if (this.props.container.galleryWidth >= (utils.getWindowWidth() - 10)) {
      classNames += ' streched';
    }

    return (<div className={classNames} style={styles}>
      {thumbnails[0]}
      {gallery}
      {thumbnails[1]}
    </div>);

  }

}


export default SlideshowView;
