
import React from 'react';
import ReactDOM from 'react-dom';
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
import Wix from 'photography-client-lib/dist/src/sdk/WixSdkWrapper';
import {itemActions} from 'photography-client-lib/dist/src/item/itemActions';
import Consts from 'photography-client-lib/dist/src/utils/consts';
import * as performanceUtils from 'photography-client-lib/dist/src/utils/performanceUtils';
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
    this.isHighlight = this.isHighlight.bind(this);
    this.toggleShare = this.toggleShare.bind(this);
    this.getShare = this.getShare.bind(this);
    this.getItemHover = this.getItemHover.bind(this);
    this.getImageItem = this.getImageItem.bind(this);
    this.getVideoItem = this.getVideoItem.bind(this);
    this.getVideoItemPlaceholder = this.getVideoItemPlaceholder.bind(this);
    this.getTextItem = this.getTextItem.bind(this);
    this.getItemInner = this.getItemInner.bind(this);
    this.getItemContainerStyles = this.getItemContainerStyles.bind(this);
    this.getItemWrapperStyles = this.getItemWrapperStyles.bind(this);
    this.getItemAriaLabel = this.getItemAriaLabel.bind(this);
    this.getItemContainerClass = this.getItemContainerClass.bind(this);
    this.getItemWrapperClass = this.getItemWrapperClass.bind(this);
    this.getItemContainerTabIndex = this.getItemContainerTabIndex.bind(this);
    this.getSEOLink = this.getSEOLink.bind(this);
    this.isIconTag = this.isIconTag.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);

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
  setItemLoaded() {
    performanceUtils.itemLoaded();
    performanceUtils.appLoaded();
    this.setState({
      failed: false,
      loaded: true
    });
  }

  isIconTag(tagName) {
    return (['button', 'i', 'a'].indexOf(tagName.toLowerCase()) >= 0);
  }

  toggleShare(event, forceVal) {
    event.stopPropagation();
    if (event.type === 'mouseout' && (this.isIconTag(event.target.tagName) || (event.relatedTarget && this.isIconTag(event.relatedTarget.tagName)))) {
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
  onMouseOver() {
    this.onMouseOverEvent.itemIdx = this.props.idx;
    window.dispatchEvent(this.onMouseOverEvent);
    if (this.props.type === 'video') {
      this.onVideoHover();
    }
  }

  onVideoHover() {
    const {videoPlay} = this.props.styleParams;
    if (videoPlay === 'hover' && !utils.isMobile()) {
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
    } else if (this.shouldShowHoverOnMobile()) {
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

  isHighlight() {
    return this.props.thumbnailHighlightId && this.props.thumbnailHighlightId === this.props.id;
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
    //image dimensions are for images in grid fit - placing the image with positive margins to show it within the square
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

  isVisible(elment, clientRect) {
    if (typeof clientRect === 'undefined') {
      const domElment = ReactDOM.findDOMNode(elment.video);
      if (!domElment) {
        return false;
      }
      clientRect = domElment.getBoundingClientRect();
    }
    const {top, bottom} = clientRect;
    const windowHeight = this.props.documentHeight;
    const scrollPosition = this.props.scroll.top;
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
    const props = _.pick(this.props, ['html', 'hashtag', 'photoId', 'item', 'idx', 'id', 'styleParams', 'style', 'love', 'isDemo', 'type', 'download_url', 'originalsUrl', 'isNarrow', 'isShort']);
    return <Social {...props}
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
    const props = _.pick(this.props, ['alt', 'title', 'description', 'visible', 'id', 'styleParams', 'resized_url', 'settings']);
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
  getVideoItemPlaceholder(itemHover) {
    return <VideoItemPlaceholder id={this.props.idx} resized_url={this.props.resized_url} hover={itemHover} />;
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
    const {styleParams, type, visible} = this.props;
    let itemInner;
    const imageDimensions = this.getImageDimensions();
    const itemTexts = this.getItemTextsDetails();
    const social = this.getSocial();
    const share = this.getShare();
    const itemHover = this.getItemHover([itemTexts, social, share], imageDimensions);
    switch (type) {
      case 'dummy':
        itemInner = <div/>;
        break;
      case 'video':
        if (!visible) {
          itemInner = this.getVideoItemPlaceholder(itemHover);
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
          <div className="gallery-item-info gallery-item-bottom-info" data-hook="gallery-item-info-buttons">
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
    this.toggleFullscreenIfNeeded(e);
  }

  getBottomInfoElement() {
    const {styleParams, title, type} = this.props;
    const {placements} = Consts;
    const buttonPlacement = this.getButtonPlacement();
    let bottomInfo = null;

    if (styleParams.titlePlacement === placements.SHOW_ALWAYS) {
      const isImage = type === 'image' || type === 'picture';
      const shouldShowButton = buttonPlacement === placements.SHOW_ALWAYS && styleParams.useCustomButton === true && (isImage || !utils.isStoreGallery());
      const buttonElem = shouldShowButton ? (<CustomButton styleParams={styleParams} />) : null;
      const isTitleAvailable = styleParams.allowTitle && title;
      const titleElem = isTitleAvailable ? (<ItemTitle title={title} />) : null;
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
  getItemContainerStyles() {
    const {styleParams, style, transform} = this.props;
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
    const styles = _.merge({
      width: wrapperWidth,
      margin: styleParams.imageMargin + 'px',
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      bottom: style.bottom,
      overflowY: styleParams.isSlideshow ? 'visible' : 'inherit',
      borderRadius: borderRadius + 'px'
    }, transform, boxShadow);
    return styles;
  }
  getItemWrapperStyles() {
    const {styleParams, style, transform} = this.props;
    const borderRadius = (styleParams.borderRadius < 100 ? styleParams.borderRadius : Math.min(parseInt(style.width), parseInt(style.height)));
    const height = style.height;
    const styles = {};
    styles.backgroundColor = styleParams.cubeType !== 'fit' ? style.bgColor : 'inherit';
    styles.height = height + 'px';
    styles.borderRadius = borderRadius + 'px';
    return styles;
  }

  getItemAriaLabel() {
    const {type, title} = this.props;
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
    const	label = typeName + ', ' + title + (utils.isStoreGallery() ? ', Buy Now' : '');
    return label;
  }
  getSEOLink() {
    const {styleParams} = this.props;
    const link = {};
    if (styleParams.itemClick === 'expand') {
      // For SEO only! - don't add it if the user chose not to open in expand mode.
      link.href = itemActions.getShareUrl(this.props);
    }
    return link;
  }

  getItemContainerClass() {
    const {styleParams} = this.props;
    const className = classNames('gallery-item-container', 'visible', {
      highlight: this.isHighlight(),
      clickable: styleParams.itemClick !== 'nothing',
    });
    return className;
  }
  getItemWrapperClass() {
    const {styleParams} = this.props;
    const className = 'gallery-item-wrapper visible ' + (styleParams.cubeImages ? 'cube-type-' + styleParams.cubeType : '');
    return className;
  }
  getItemContainerTabIndex() {
    const tabIndex = this.isHighlight() ? utils.getTabIndex('currentThumbnail') : (this.props.currentIdx === this.props.idx ? utils.getTabIndex('currentGalleryItem') : -1);
    return tabIndex;
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
  componentDidUpdate(prevProps) {
    if (utils.isSite() && !utils.isMobile() && document && document.activeElement && document.activeElement.className) {
			//check if thumbnailId has changed to the current item
      const isAnotherItemInFocus = document.activeElement.className.indexOf('gallery-item-container') >= 0;
      const isShowMoreInFocus = document.activeElement.className.indexOf('show-more') >= 0;
      if (isAnotherItemInFocus || isShowMoreInFocus) {
        if ((this.props.thumbnailHighlightId !== prevProps.thumbnailHighlightId) && (this.props.thumbnailHighlightId === this.props.id)) {
					// if the highlighted thumbnail changed and it is the same as this itemview's
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
    const {photoId, id, hash, idx} = this.props;
    return (
      <div className={this.getItemContainerClass()}
           ref={e => this.itemContainer = e}
           onMouseOver={this.onMouseOver}
           onClick={this.onItemClick}
           onKeyDown={this.onKeyPress}
           tabIndex={this.getItemContainerTabIndex()}
           data-hash={hash}
           data-id={photoId}
           data-idx={idx}
           aria-label={this.getItemAriaLabel()}
           role="link"
           aria-level="0"
           data-hook="item-container"
           key={'item-container-' + id}
           style={this.getItemContainerStyles()}
           {...this.getSEOLink()}
      >
        <div data-hook="item-wrapper" className={this.getItemWrapperClass()}
          key={'item-wrapper-' + id}
          style={this.getItemWrapperStyles()}
          >
          {this.getItemInner()}
        </div>
        {this.getBottomInfoElement()}
      </div>
    );
  }
}

export default ItemView;
