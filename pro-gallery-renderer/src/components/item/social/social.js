import React from 'react';
import utils from '../../../utils/index.js';
import LoveButton from '../loveButton/loveButton.js';
import _ from 'lodash';
import { GalleryContext } from '../../../context/GalleryContext.js';
import window from '../../../utils/window/windowWrapper';
import EVENTS from '../../../utils/constants/events';
import PLACEMENTS from '../../../utils/constants/placements';

export default class Social extends React.Component {
  constructor(props) {
    super(props);
    this.onDownloadKeyPress = this.onDownloadKeyPress.bind(this);
    this.onDownloadTextKeyPress = this.onDownloadTextKeyPress.bind(this);
  }

  getSocialShare() {
    const styleParams = this.context.styleParams;
    const { id, actions } = this.props;
    if (styleParams.allowSocial) {
      const slideshowShareButton = (
        <i
          className={'block-fullscreen progallery-svg-font-icons-share-store'}
        />
      );
      if (utils.isSite()) {
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
            onMouseOver={e =>
              actions.itemActions.showTooltip(
                e,
                'Gallery_Sharing_Disabled_In_Editor',
              )
            }
            onMouseOut={() => actions.itemActions.hideTooltip()}
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
    const { styleParams, love } = this.props;
    const props = _.pick(this.props, [
      'id',
      'item',
      'idx',
      'currentIdx',
      'styleParams',
      'hashtag',
      'love',
      'actions',
    ]);
    return styleParams.loveButton ? (
      <LoveButton
        {...props}
        itemId={this.props.photoId}
        layout={styleParams.isSlideshow ? 'slideshow' : 'gallery'}
        showCounter={love && love.showCounter}
      />
    ) : (
      ''
    );
  }

  getDownload() {
    const item = _.pick(this.props, ['html', 'style']);
    const { styleParams, isDemo, type, download_url, actions } = this.props;
    if (
      styleParams.allowDownload &&
      !utils.isiOS() &&
      !(utils.isSite() && isDemo)
    ) {
      const className =
        'block-fullscreen gallery-item-social-download ' +
        (styleParams.allowSocial ? '' : ' pull-right ') +
        ' gallery-item-social-button';
      const downloadIcon = (
        <i
          className={
            'block-fullscreen progallery-svg-font-icons-download' +
            (isDemo ? ' inactive' : '')
          }
        />
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
      const downloadLink =
        download_url.mp4 || download_url.webm || download_url.img;
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
          <a
            {...genralProps}
            onClick={e => {
              e.stopPropagation();
              actions.itemActions.downloadTextItem(item, 'gallery');
            }}
            onKeyDown={e => this.onDownloadTextKeyPress(e, item)}
          >
            {downloadIcon}
          </a>
        );
      } else {
        const props = isDemo
          ? {
              onMouseOver: e =>
                actions.itemActions.showTooltip(
                  e,
                  'Gallery_Hover_Download_FreeImages_Text',
                ),
              onMouseOut: () => actions.itemActions.hideTooltip(),
            }
          : itemProps;
        return (
          <a {...genralProps} download="download" {...props}>
            {downloadIcon}
          </a>
        );
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

  onDownloadTextKeyPress(e, item) {
    switch (e.keyCode || e.charCode) {
      case 32: //space
      case 13: //enter
        e.stopPropagation();
        this.props.actions.itemActions.downloadTextItem(item, 'gallery');
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

Social.contextType = GalleryContext;
