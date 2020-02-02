import React from 'react';
import utils from '../../../common/utils/index.js';
import LoveButton from '../loveButton/loveButton.js';
import { GalleryComponent } from '../../galleryComponent';
import window from '../../../common/window/windowWrapper';
import { isSiteMode, isSEOMode } from '../../../common/window/viewModeWrapper';
import EVENTS from '../../../common/constants/events';
import PLACEMENTS from '../../../common/constants/placements';
import { URL_TYPES, URL_SIZES } from '../../../common/constants/urlTypes';
import DownloadIcon from '../../svgs/components/download';
import ShareStoreIcon from '../../svgs/components/share_store';

export default class Social extends GalleryComponent {
  constructor(props) {
    super(props);
    this.onDownloadKeyPress = this.onDownloadKeyPress.bind(this);
    this.onDownloadTextKeyPress = this.onDownloadTextKeyPress.bind(this);
  }

  getSocialShare() {
    const { styleParams, id, actions } = this.props;
    if (styleParams.allowSocial) {
      const slideshowShareButton = (
        <i
          className={'block-fullscreen share-store'}
        ><ShareStoreIcon size="20"/></i>
      );
      if (isSiteMode() || isSEOMode()) {
        const slideshowShare = styleParams.isSlideshow
          ? actions.getShare()
          : '';
        return (
          <div
            className={
              'block-fullscreen gallery-item-social-share gallery-item-social-button'
            }
            data-hook="gallery-item-social-button"
            key={'item-social-share-' + id}
            onClick={e => actions.toggleShare(e, true)}
          >
            {slideshowShareButton}
            {slideshowShare}
          </div>
        );
      } else {
        return (
          <div
            className={
              'show-tooltip block-fullscreen gallery-item-social-share gallery-item-social-button'
            }
            data-hook="gallery-item-social-button"
            key={'item-social-share-' + id}
            onClick={e => e.stopPropagation()}
          >
            {slideshowShareButton}
          </div>
        );
      }
    }
    return '';
  }

  getLoveButton() {
    const { styleParams, isNarrow, isSmallItem } = this.props;
    const props = utils.pick(this.props, [
      'id',
      'item',
      'idx',
      'currentIdx',
      'styleParams',
      'hashtag',
      'type',
      'actions',
      'loveCount',
      'isLoved',
    ]);
    return styleParams.loveButton ? (
      <LoveButton
        {...props}
        itemId={this.props.photoId}
        layout={styleParams.isSlideshow ? 'slideshow' : 'gallery'}
        showCounter={styleParams.loveCounter && !isSmallItem && !isNarrow}
      />
    ) : (
      ''
    );
  }

  getDownload() {
    const { styleParams, isDemo, type, createUrl, actions } = this.props;
    if (
      styleParams.allowDownload &&
      !utils.isiOS() &&
      !((isSiteMode() || isSEOMode()) && isDemo)
    ) {
      const className =
        'block-fullscreen gallery-item-social-download ' +
        (styleParams.allowSocial ? '' : ' pull-right ') +
        ' gallery-item-social-button';
      const downloadIcon = (
        <i
          className={
            'block-fullscreen ' +
            (isDemo ? ' inactive' : '')
          }
        ><DownloadIcon size="20"/></i>
      );

      const genralProps = {
        className,
        'data-hook': 'item-download',
        'aria-label': 'Download',
        role: 'button',
        tabIndex:
          styleParams.isSlideshow && this.props.currentIdx === this.props.idx
            ? 0
            : -1,
      };
      const downloadUrl = styleParams.isStoreGallery
        ? URL_SIZES.DOWNLOAD_SAMPLE
        : URL_SIZES.DOWNLOAD;
      const downloadLink =
        createUrl(downloadUrl, URL_TYPES.VIDEO) ||
        createUrl(downloadUrl, URL_TYPES.HIGH_RES);

      const itemProps = {
        target: '_blank',
        href: downloadLink,
        onClick: e => {
          e.stopPropagation();
          e.preventDefault();
          window.open(downloadLink, '_blank');
          this.props.actions.eventsListener(
            EVENTS.DOWNLOAD_BUTTON_CLICKED,
            this.props,
          );
        },
        onKeyDown: e => this.onDownloadKeyPress(e, downloadLink),
      };
      if (type === 'text') {
        return (
          <div
            {...genralProps}
            onClick={e => {
              e.stopPropagation();
              actions.eventsListener(
                EVENTS.TEXT_DOWNLOAD_BUTTON_CLICKED,
                this.props,
              );
            }}
            onKeyDown={e => this.onDownloadTextKeyPress(e)}
          >
            {downloadIcon}
          </div>
        );
      } else {
        if (!isDemo) {
          return (
            <div {...genralProps} download="download" {...itemProps}>
              {downloadIcon}
            </div>
          );
        } else {
          return (
            <div {...genralProps} download="download">
              {downloadIcon}
            </div>
          );
        }
      }
    }
    return '';
  }

  onDownloadKeyPress(e, downloadLink) {
    switch (e.keyCode || e.charCode) {
      case 32: //space
      case 13: //enter
        e.stopPropagation();
        e.preventDefault();
        window.open(downloadLink, '_blank');
        this.props.actions.eventsListener(
          EVENTS.DOWNLOAD_BUTTON_CLICKED,
          this.props,
        );
        return false;
    }
  }

  onDownloadTextKeyPress(e) {
    switch (e.keyCode || e.charCode) {
      case 32: //space
      case 13: //enter
        e.stopPropagation();
        this.props.actions.eventsListener(
          EVENTS.TEXT_DOWNLOAD_BUTTON_CLICKED,
          this.props,
        );
        return false;
    }
  }

  render() {
    const {
      styleParams,
      id,
      showShare,
      isSmallItem,
      isNarrow,
      isShort,
      isVerticalContainer,
    } = this.props;
    const socialShare = this.getSocialShare();
    const loveButton = this.getLoveButton();
    const download = this.getDownload();
    //var shopIcons = this.getShopIcons();
    const isShowArrows = styleParams.hasThumbnails;
    const isPopulated =
      styleParams.allowSocial ||
      styleParams.loveButton ||
      styleParams.allowDownload;
    const textPlacementAboveOrBelow =
      styleParams.titlePlacement === PLACEMENTS.SHOW_BELOW ||
      styleParams.titlePlacement === PLACEMENTS.SHOW_ABOVE;

    const classes = [
      [showShare, 'hidden'],
      [isSmallItem, 'small-item'],
      [isShort, 'short-item'],
      [isNarrow, 'narrow-item'],
      [isVerticalContainer, 'vertical-item'],
      [isShowArrows, 'with-arrows'],
      [isPopulated, 'populated-item'],
      [textPlacementAboveOrBelow, 'text-external-item'],
    ]
      .filter(x => x[0])
      .map(x => x[1])
      .join(' ');

    return (
      <div
        className={
          'gallery-item-social gallery-item-direction-' +
          styleParams.galleryTextAlign +
          ' ' +
          classes
        }
        key={'item-social-' + id}
        data-hook="item-social"
      >
        {loveButton}
        {download}
        {socialShare}
      </div>
    );
  }
}
