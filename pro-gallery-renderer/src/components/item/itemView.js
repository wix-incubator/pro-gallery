
import React from 'react';
import ReactDOM from 'react-dom';
import LoveButton from './loveButton/loveButton.js';
import ImageItem from './imageItem.js';
import VideoItem from './videos/videoItem';
import TextItem from './textItem.js';
import VideoItemPlaceholder from './videos/videoItemPlaceholder.js';
import ItemHover from './itemHover.js';
import Texts from './texts/texts.js';
import Social from './social/social.js';
import Share from './share/share.js';
import CustomButton from './buttons/customButton.js';
import ItemTitle from './texts/itemTitle.js';
import {Wix, Consts, performanceUtils, itemActions} from 'photography-client-lib';
import classNames from 'classnames';
import utils from '../../utils/index.js';
import _ from 'lodash';

class ItemView extends React.Component {

  constructor(props) {
    performanceUtils.itemLoadStart();
    super(props);

    this.init();

    this.state = {
      failed: false,
      loaded: false,
      retries: 0,
      showShare: false,
      showHover: false,
    };
  }

  //-------------------------------------------| INIT |--------------------------------------------//

  init() {
    this.onItemClick = this.onItemClick.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.toggleFullscreenIfNeeded = this.toggleFullscreenIfNeeded.bind(this);
    this.toggleMultishareSelection = this.toggleMultishareSelection.bind(this);
    this.handleItemMouseDown = this.handleItemMouseDown.bind(this);
    this.handleItemMouseUp = this.handleItemMouseUp.bind(this);
    this.setItemLoaded = this.setItemLoaded.bind(this);
    this.setItemError = this.setItemError.bind(this);
    this.isMultishared = this.isMultishared.bind(this);
    this.isMultisharing = this.isMultisharing.bind(this);
    this.isVerticalContainer = this.isVerticalContainer.bind(this);
    this.toggleShare = this.toggleShare.bind(this);
    this.getShare = this.getShare.bind(this);
    this.getItemHover = this.getItemHover.bind(this);
    this.getImageItem = this.getImageItem.bind(this);
    this.getVideoItem = this.getVideoItem.bind(this);
    this.getTextItem = this.getTextItem.bind(this);
    this.getItemInner = this.getItemInner.bind(this);

    if (utils.isEditor()) {
      Wix.addEventListener(Wix.Events.SETTINGS_UPDATED, data => {
        setTimeout(() => {
          this.setState({
            showHover: (data.detail === 2)
          });
        }, 50);
      });
    }

    if (utils.isSemiNative()) {
      this.onMouseOverEvent = new window.CustomEvent('on_mouse_over'); // MUST be 'CustomEvent'
    } else {
      this.onMouseOverEvent = document.createEvent('CustomEvent'); // MUST be 'CustomEvent'
      this.onMouseOverEvent.initCustomEvent('on_mouse_over', false, false, null);
    }
  }

  //----------------------------------------| ACTIONS |-------------------------------------------//

  setItemError() {
    this.setState({
      retries: this.state.retries + 1,
      failed: (this.state.retries >= 3)
    });
  }

  setItemLoaded(e) {
    performanceUtils.itemLoaded();
    this.setState({
      failed: false,
      loaded: true
    });
  }

  toggleShare(event, forceVal) {
    event.stopPropagation();
    const isIconTag = tagName => ['button', 'i', 'a'].indexOf(tagName.toLowerCase()) >= 0;
    if (event.type === 'mouseout' && (isIconTag(event.target.tagName) || (event.relatedTarget && isIconTag(event.relatedTarget.tagName)))) {
      //mouseout event should not be fired if hovering over icons (tag name === I)
      return;
    }

    this.setState({
      showShare: (_.isUndefined(forceVal) ? !this.state.showShare : !!forceVal)
    });
  }

  toggleHoverOnMobile() {
    this.setState({
      showHover: !this.state.showHover
    });
  }

  onMouseOver(imageUrl) {
    this.onMouseOverEvent.itemIdx = this.props.idx;
    window.dispatchEvent(this.onMouseOverEvent);
    if (this.props.type === 'video') {
      this.onVideoHover();
    }
  }

  onVideoHover() {
    const {videoPlay, itemClick} = this.props.styleParams;

    if (this.props.styleParams.videoPlay === 'hover' && !utils.isMobile()) {
      this.props.playVideo(this.props.idx);
    }
  }

  onKeyPress(e) {
    switch (e.keyCode || e.charCode) {
      case 32: //space
      case 13: //enter
        e.preventDefault();
        e.stopPropagation();
        this.onItemClick(e, false); //pressing enter or space always behaves as click on main image, even if the click is on a thumbnail
        return false;
    }
  }

  onItemClick(e, isThumbnail) {

    e.preventDefault();

    const {itemClick, videoPlay} = this.props.styleParams;

    if (!_.isBoolean(isThumbnail)) {
      isThumbnail = !!this.props.thumbnailHighlightId;
    }

    if (!isThumbnail && _.isFunction(_.get(window, 'galleryWixCodeApi.onItemClicked'))) {
      window.galleryWixCodeApi.onItemClicked(this.props);
    }

    if (isThumbnail === true && _.isFunction(this.props.actions.scrollToItem)) {
      //the click is on a thumbnail
      this.props.actions.scrollToItem(this.props.idx);
    } else if (itemClick === 'expand' || itemClick === 'link') {
      this.props.actions.toggleFullscreen(this.props.idx);
    } else if (this.props.type === 'video') {
      const shouldTogglePlay = itemClick !== 'expand' && (videoPlay === 'onClick' || utils.isMobile());
      if (shouldTogglePlay) {
        this.props.playing ? this.props.pauseVideo(this.props.idx) : this.props.playVideo(this.props.idx);
      }
    } else if (itemClick === 'nothing' && utils.isMobile()) {
      this.toggleHoverOnMobile();
    }
  }

  toggleFullscreenIfNeeded(e) {
    let targetClass = _.get(e, 'target.className');
    if (_.isObject(targetClass)) {
      targetClass = _.valuesIn(targetClass);
    }

    if (_.isFunction(targetClass.indexOf) && targetClass.indexOf('block-fullscreen') >= 0) {
      console.warn('Blocked fullscreen!', e);
      return;
    } else if (this.props.styleParams.fullscreen) {
      this.props.actions.toggleFullscreen(this.props.idx);
    }
  }

  toggleMultishareSelection(e) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    const itemContainer = this.itemContainer;
    itemContainer.style.transform = 'scale(' + ((this.props.style.width - 8) / this.props.style.width) + ')';
    setTimeout(() => {
      itemContainer.style.transform = 'scale(1)';
    }, 80);

    if (this.isMultishared()) {
      this.props.actions.removeItemFromMultishare(this.props);
    } else {
      this.props.actions.addItemToMultishare(this.props);
    }
  }

  handleItemMouseDown(e) {
    if (utils.isMobile() && this.props.styleParams.allowMultishare) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = setTimeout(() => {
        e.preventDefault(); //prevent default only after a long press (so that scroll will not break)
        this.toggleMultishareSelection(e);
      }, 500);
    }
    return true; //make sure the default event behaviour continues
  }

  handleItemMouseUp(e) {
    if (utils.isMobile() && this.longPressTimer) {
      clearTimeout(this.longPressTimer);
    }
    return true; //make sure the default event behaviour continues
  }

  //-----------------------------------------| UTILS |--------------------------------------------//

  isSmallItem() {
    return this.props.isSmallItem && !this.props.styleParams.isSlideshow;
  }

  isVerticalContainer() {
    return this.props.style.width < (this.props.style.height + 1);
  }

  shouldShowHoverOnMobile() {
    return (utils.isMobile() && (this.props.styleParams.itemClick === 'nothing'));
  }

  shouldHover() {
    if (this.isMultisharing()) {
      return true;
    } else if (this.props.styleParams.isSlideshow) {
      return false;
    } else if (this.props.styleParams.allowHover === false) {
      return false;
    } else if (utils.isMobile()) {
      return this.shouldShowHoverOnMobile();
    } else if (utils.isEditor()) {
      return this.state.showHover;
    } else {
      return true;
    }
  }

  isMultishared() {
    const items = _.get(this, 'props.multishare.items');
    return items && !!_.find(items, itemProps => {
      return (itemProps.id === this.props.id);
    });
  }

  isMultisharing() {
    return _.get(this, 'props.multishare.isMultisharing');
  }

  //---------------------------------------| COMPONENTS |-----------------------------------------//

  getImageDimensions() {
    //image dimensions are for images in grif fit - placing the image with positive margins to show it within the square
    const imageIsWider = this.props.style.ratio >= this.props.cubeRatio;
    const imageMarginLeft = Math.round((this.props.style.height * this.props.style.ratio - this.props.style.width) / -2);
    const imageMarginTop = Math.round((this.props.style.width / this.props.style.ratio - this.props.style.height) / -2);

    return !((this.props.styleParams.cubeImages && this.props.styleParams.cubeType === 'fit')) ? {} : (!imageIsWider ? {
      width: `calc(100% - ${2 * imageMarginLeft}px)`,
      marginLeft: imageMarginLeft
    } : {
      height: `calc(100% - ${2 * imageMarginTop}px)`,
      marginTop: imageMarginTop
    });
  }

  isVisible(elment) {
    const domElment = ReactDOM.findDOMNode(elment.video);
    if (!domElment) {
      return false;
    }
    const windowHeight = this.props.documentHeight;
    const scrollPosition = this.props.scroll.top;
    const {top, bottom} = domElment.getBoundingClientRect();
    const videoHeight = bottom - top;
    const tolerance = videoHeight / 2;
    const res = top + tolerance > scrollPosition && bottom - tolerance < scrollPosition + windowHeight;

    return res;
  }

  getButtonPlacement() {
    return this.props.styleParams.titlePlacement;
  }

  videoOnMount(videoElment) {
    this.props.videoAdded({idx: this.props.idx, isVisible: () => this.isVisible(videoElment)});
  }

  videoOnUnmount() {
    this.props.videoRemoved(this.props.idx);
  }

  getItemTextsDetails() {
    const props = _.pick(this.props, ['title', 'description', 'fileName', 'id', 'styleParams', 'style', 'isNarrow']);
    const isButtonPlacementOnHover = this.getButtonPlacement() === Consts.placements.SHOW_ON_HOVER;
    const isImage = this.props.type === 'image' || this.props.type === 'picture';
    const useCustomButton = this.props.styleParams.useCustomButton === true;
    const shouldShowButton = isButtonPlacementOnHover && (isImage || !utils.isStoreGallery()) && useCustomButton;

    return <Texts {...props}
              key={`item-texts-${props.id}`}
              showShare={this.state.showShare}
              isSmallItem={this.isSmallItem()}
              titlePlacement={this.props.styleParams.titlePlacement}
              shouldShowButton={shouldShowButton} />;
  }

  getSocial() {
    const props = _.pick(this.props, ['id', 'styleParams', 'style', 'love', 'isDemo', 'type', 'download_url', 'originalsUrl', 'isNarrow', 'isShort']);
    return <Social {...props}
              allProps={this.props}
              showShare={this.state.showShare}
              isSmallItem={this.isSmallItem()}
              isVerticalContainer={this.isVerticalContainer()}
              key={`item-social-${props.id}`}
              actions={{
                openItemShopInFullScreen: this.openItemShopInFullScreen,
                toggleMultishareSelection: this.toggleMultishareSelection,
                toggleShare: this.toggleShare,
                getShare: this.getShare,
                showTooltip: itemActions.showTooltip,
                hideTooltip: itemActions.hideTooltip,
              }}
              />;
  }

  getShare() {
    const props = _.pick(this.props, ['styleParams', 'id', 'type', 'style', 'currentIdx', 'idx']);
    return <Share {...props}
              allProps={this.props}
              key={`item-share-${props.id}`}
              showShare={this.state.showShare}
              isVerticalContainer={this.isVerticalContainer()}
              actions={{
                toggleShare: this.toggleShare,
              }}
              />;
  }

  getItemHover(children, imageDimensions) {
    const props = _.pick(this.props, ['styleParams', 'type', 'idx', 'type']);
    return <ItemHover {...props}
            forceShowHover={this.props.previewHover || this.state.showHover}
            isMultisharing={this.isMultisharing()}
            isMultishared={this.isMultishared()}
            shouldHover={this.shouldHover()}
            imageDimensions={imageDimensions}
            key="hover"
            actions={{
              handleItemMouseDown: this.handleItemMouseDown,
              handleItemMouseUp: this.handleItemMouseUp,
              toggleMultishareSelection: this.toggleMultishareSelection,
            }}
            >
              {children}
            </ItemHover>;
  }

  getImageItem(imageDimensions) {
    const props = _.pick(this.props, ['alt', 'title', 'description', 'visible', 'id', 'styleParams', 'resized_url']);
    return <ImageItem {...props}
            key="imageItem"
            loaded={this.state.loaded}
            imageDimensions={imageDimensions}
            isThumbnail={!!this.props.thumbnailHighlightId}
            actions={{
              handleItemMouseDown: this.handleItemMouseDown,
              handleItemMouseUp: this.handleItemMouseUp,
              setItemLoaded: this.setItemLoaded,
              setItemError: this.setItemError,
            }}
           />;
  }

  getVideoItem(imageDimensions, itemHover) {
    const props = _.pick(this.props, []);
    return <VideoItem
            {...this.props}
            onMount={this.videoOnMount.bind(this)}
            onUnmount={this.videoOnUnmount.bind(this)}
            onEnd={this.props.videoEnded.bind(this)}
            key={'video' + this.props.idx}
            hover={itemHover}
            imageDimensions={imageDimensions}
            loadingStatus={{
              failed: this.state.failed,
              loaded: this.state.loaded,
            }}
            onClick={this.handleVideoClick}
            actions={_.merge({}, this.props.actions, {
              setItemLoaded: this.setItemLoaded,
              setItemError: this.setItemError,
              handleItemMouseDown: this.handleItemMouseDown,
              handleItemMouseUp: this.handleItemMouseUp,
              toggleMultishareSelection: this.toggleMultishareSelection,
              isMultishared: this.isMultishared,
              isMultisharing: this.isMultisharing,
            })}
            />;
  }

  getTextItem() {
    const props = _.pick(this.props, ['visible', 'id', 'styleParams', 'style', 'html', 'cubeRatio']);

    return <TextItem
              {...props}
              key="textItem"
              actions={{
                handleItemMouseDown: this.handleItemMouseDown,
                handleItemMouseUp: this.handleItemMouseUp,
                setItemLoaded: this.setItemLoaded,
              }}
              />;
  }

  getItemInner() {
    const {styleParams, id, title} = this.props;
    let itemInner;

    const imageDimensions = this.getImageDimensions();
    const itemTexts = this.getItemTextsDetails();
    const social = this.getSocial();
    const share = this.getShare();

    const itemHover = this.getItemHover([itemTexts, social, share], imageDimensions);

    switch (this.props.type) {
      case 'dummy':
        itemInner = <div/>;
        break;
      case 'video':
        if (!this.props.visible) {
          itemInner = <VideoItemPlaceholder id={this.props.idx} resized_url={this.props.resized_url} hover={itemHover} />;
        } else {
          itemInner = this.getVideoItem(imageDimensions, itemHover);
        }

        break;
      case 'text':
        itemInner = [this.getTextItem(), itemHover];
        break;
      case 'image':
      case 'picture':
      default:
        itemInner = [this.getImageItem(imageDimensions), itemHover];
    }

    if (styleParams.isSlideshow) {
      itemInner = (<div>
        {itemInner}
        { (this.props.currentIdx === this.props.idx) ?
          <div className="gallery-item-info gallery-item-bottom-info">
            <div>
              {itemTexts}
              {social}
              {share}
            </div>
          </div> :
          false
        }
      </div>);
    }

    return itemInner;
  }

  openItemShopInFullScreen(e) {
    e.preventDefault();
    e.stopPropagation();
    this.toggleFullscreenIfNeeded(e, {openShop: true});
  }

  mouseOver(imageUrl) {
    this.onMouseOverEvent.itemIdx = this.props.idx;
    window.dispatchEvent(this.onMouseOverEvent);
  }

  getBottomInfoElement() {
    const {styleParams, style, title, fileName, type, actions} = this.props;
    const displayTitle = utils.getTitleOrFilename(title, fileName);
    const {placements} = Consts;
    const buttonPlacement = this.getButtonPlacement();
    let bottomInfo = null;

    if (styleParams.titlePlacement === placements.SHOW_ALWAYS) {
      let buttonElem = null;
      const isImage = type === 'image' || type === 'picture';
      const shouldShowButton = buttonPlacement === placements.SHOW_ALWAYS && styleParams.useCustomButton === true && (isImage || !utils.isStoreGallery());
      buttonElem = shouldShowButton ? (<CustomButton styleParams={styleParams} />) : null;
      const isTitleAvailable = styleParams.allowTitle && displayTitle;
      const titleElem = isTitleAvailable ? (<ItemTitle title={displayTitle} />) : null;
      if (titleElem || buttonElem) {
        bottomInfo = (
          <div style={{height: styleParams.bottomInfoHeight, textAlign: styleParams.galleryTextAlign}}
              className="gallery-item-bottom-info"
              onMouseOver={() => {
                this.setState({showHover: true});
              }}
              onMouseOut={() => {
                this.setState({showHover: false});
              }}>
            {titleElem}
            {buttonElem}
          </div>);
      }
    }
    return bottomInfo;
  }
  //-----------------------------------------| REACT |--------------------------------------------//

  componentDidMount() {
    if (utils.isMobile()) {
      try {
        React.initializeTouchEvents(true);
      } catch (e) {

      }
    }
  }

  componentWillReceiveProps(props) {
    //
  }

  componentDidUpdate(prevProps, prevState) {
    if (utils.isSite()) {
      //check if thumbnailId has changed to the current item
      const isAnotherItemInFocus = document.activeElement.className.indexOf('gallery-item-container') >= 0;
      const isShowMoreInFocus = document.activeElement.className.indexOf('show-more') >= 0;
      if (isAnotherItemInFocus || isShowMoreInFocus) {
        if ((this.props.thumbnailHighlightId !== prevProps.thumbnailHighlightId) && (this.props.thumbnailHighlightId === this.props.id)) {
          this.itemContainer.focus();
        } else if ((this.props.currentIdx !== prevProps.currentIdx) && (this.props.currentIdx === this.props.idx)) {
          //check if currentIdx has changed to the current item
          this.itemContainer.focus();
        }
      }
    }
  }

  //-----------------------------------------| RENDER |--------------------------------------------//

  render() {
    const {styleParams, photoId, id, style, hash, full_url, idx, title, type} = this.props;
    const itemInner = this.getItemInner();

    const isHighlight = this.props.thumbnailHighlightId && this.props.thumbnailHighlightId === this.props.id;
    const tabIndex = isHighlight ? utils.getTabIndex('currentThumbnail') : (this.props.currentIdx === this.props.idx ? utils.getTabIndex('currentGalleryItem') : -1);

    const bottomInfo = this.getBottomInfoElement();
    const bottomInfoHeight = this.props.bottomInfoHeight || 0;
    const height = style.height;
    const wrapperWidth = style.width;
    const borderRadius = (styleParams.borderRadius < 100 ? styleParams.borderRadius : Math.min(parseInt(style.width), parseInt(style.height)));

    let boxShadow = {};
    if (styleParams.boxShadow > 0) {
      const shadowOffset = Math.round(styleParams.imageMargin * styleParams.boxShadow / 5);
      const shadowSpread = Math.min(15, Math.round(styleParams.imageMargin * styleParams.boxShadow / 2));
      boxShadow = {
        boxShadow: `${shadowOffset}px ${shadowOffset}px ${shadowSpread}px 0 rgba(0,0,0,0.2)`
      };
    }

    const itemStyle = {};
    itemStyle.backgroundColor = styleParams.cubeType !== 'fit' ? style.bgColor : 'inherit';
    itemStyle.height = height + 'px';
    itemStyle.borderRadius = borderRadius + 'px';

    let typeName;
    switch (type) {
      case 'dummy':
        typeName = '';
        break;
      case 'text':
        typeName = 'Text Box';
        break;
      case 'video':
        typeName = 'Video';
        break;
      default:
        typeName = 'Graphic';
        break;
    }

    const className = classNames('gallery-item-container', 'visible', {
      highlight: isHighlight,
      clickable: styleParams.itemClick !== 'nothing',
    });

    const additionalAttributes = {};

    if (styleParams.itemClick === 'expand') {
      // For SEO only! - don't add it if the user chose not to open in expand mode.
      additionalAttributes.href = itemActions.getShareUrl(this.props);
    }

    return (
      <div className={className}
           href={itemActions.getShareUrl(this.props)}
           ref={e => this.itemContainer = e}
           onMouseOver={() => this.onMouseOver()}
           onClick={this.onItemClick}
           onKeyDown={this.onKeyPress}
           tabIndex={tabIndex}
           data-hash={hash}
           data-id={photoId}
           data-idx={idx}
           aria-label={typeName + ', ' + title + (utils.isStoreGallery() ? ', Buy Now' : '')}
           role="link"
           aria-level="0"
           data-hook="item-container"
           key={'item-container-' + id}
           style={_.merge({
             width: wrapperWidth,
             margin: styleParams.imageMargin + 'px',
             position: style.position,
             top: style.top,
             left: style.left,
             right: style.right,
             bottom: style.bottom,
             overflowY: styleParams.isSlideshow ? 'visible' : 'inherit',
             borderRadius: borderRadius + 'px'
           }, this.props.transform, boxShadow)
           }
           {...additionalAttributes}
      >
        <div data-hook="item-wrapper" className={'gallery-item-wrapper visible ' + (styleParams.cubeImages ? 'cube-type-' + styleParams.cubeType : '')}
          key={'item-wrapper-' + id}
          style={itemStyle}
          >
          {itemInner}
        </div>
        {bottomInfo}
      </div>
    );
  }
}

export default ItemView;
