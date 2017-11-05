import React from 'react';
import utils from '../../../utils/index.js';
import LoveButton from '../loveButton/loveButton.js';

export default class Social extends React.Component {
  constructor(props) {
    super(props);
  }

  getSocialShare() {
    const {styleParams, id, actions} = this.props;
    if (styleParams.allowSocial) {
      const slideshowShareButton = <i className={'block-fullscreen progallery-svg-font-icons-share-store ' + (utils.isSite() ? '' : ' inactive ')} />;
      const slideshowShare = (styleParams.isSlideshow ? actions.getShare() : '');

      if (utils.isSite()) {
        return <div className={'block-fullscreen gallery-item-social-share gallery-item-social-button'}
          key={'item-social-share-' + id}
          onClick={e => actions.toggleShare(e, true)}>
          {slideshowShareButton}
          {slideshowShare}
        </div>;
      } else {
        return <div className={'show-tooltip block-fullscreen gallery-item-social-share gallery-item-social-button'}
          key={'item-social-share-' + id}
          onMouseOver={e => itemActions.showTooltip(e, 'Gallery_Sharing_Disabled_In_Editor')}
          onMouseOut={() => itemActions.hideTooltip()}
          >
          {slideshowShareButton}
        </div>;
      }
    }
    return '';
  }

  getMultishare() {
    const {styleParams, id, actions} = this.props;
    if (styleParams.allowMultishare) {
      if (utils.isSite()) {
        return <div className={'block-fullscreen gallery-item-social-multishare gallery-item-social-button'}
          key={'item-social-multishare-' + id}
          onClick={actions.toggleMultishareSelection}>
          <svg className={'block-fullscreen'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
            <path className="gallery-item-svg-foreground"
              d="M9,1A8,8,0,1,1,1,9,8,8,0,0,1,9,1M9,0a9,9,0,1,0,9,9A9,9,0,0,0,9,0Z" />
          </svg>
        </div>;
      } else {
        return <div className={'show-tooltip block-fullscreen gallery-item-social-multishare gallery-item-social-button '}
          onMouseOver={e => itemActions.showTooltip(e, 'Gallery_Sharing_Disabled_In_Editor')}
          onMouseOut={() => itemActions.hideTooltip()}
          key={'item-social-multishare-' + id}
          >
          <svg className={'block-fullscreen inactive'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
            <path className="gallery-item-svg-foreground"
              d="M9,1A8,8,0,1,1,1,9,8,8,0,0,1,9,1M9,0a9,9,0,1,0,9,9A9,9,0,0,0,9,0Z" />
          </svg>
        </div>;
      }
    }
    return false;
  }

  getLoveButton() {
    const {styleParams, love, isNarrow} = this.props;
    return styleParams.loveButton ? (
      <LoveButton
        layout={styleParams.isSlideshow ? 'slideshow' : 'gallery'}
        {...love}
        showCounter={love && love.showCounter}
        />
    ) : '';
  }

  getDownload() {
    const {styleParams, isDemo, type, allProps, download_url} = this.props;
    if (styleParams.allowDownload && !utils.isiOS() && !(utils.isSite() && isDemo)) {
      const className = 'block-fullscreen gallery-item-social-download ' + (styleParams.allowSocial ? '' : ' pull-right ') + ' gallery-item-social-button';
      const downloadIcon = <i className={'block-fullscreen progallery-svg-font-icons-download' + (isDemo ? ' inactive' : '')} />;

      const genralProps = {
        className,
        'data-hook': 'item-download',
      };

      const itemProps = {
        download: 'download',
        target: '_blank',
        href: download_url.mp4 || download_url.webm || download_url.img,
        onClick: e => {
          e.stopPropagation();
          logger.trackBi(logger.biEvents.download, {origin: 'gallery'});
        },
      };
      if (type === 'text') {
        return <a
          {...genralProps}
          onClick={e => {
            e.stopPropagation();
            itemActions.downloadTextItem(allProps, 'gallery');
          }} >
          {downloadIcon}
        </a>;
      } else {
        const props = isDemo ? {
          onMouseOver: e => itemActions.showTooltip(e, 'Gallery_Hover_Download_FreeImages_Text'),
          onMouseOut: () => itemActions.hideTooltip(),
        } : {
          target: '_blank',
          href: download_url.mp4 || download_url.webm || download_url.img,
          onClick: e => {
            e.stopPropagation();
            logger.trackBi(logger.biEvents.download, {origin: 'gallery'});
          },
        };
        return <a
          {...genralProps}
          download="download"
          role="button"
          {...props}
        >
          {downloadIcon}
        </a>;
      }
    }
    return '';
  }

  render() {
    const {styleParams, id, showShare, actions, isSmallItem, isNarrow, isShort, isVerticalContainer} = this.props;
    const socialShare = this.getSocialShare();
    const multishare = this.getMultishare();
    const loveButton = this.getLoveButton();
    const download = this.getDownload();
    //var shopIcons = this.getShopIcons();
    const isShowArrows = styleParams.hasThumbnails;

    const classes = [
      [showShare, 'hidden'],
      [isSmallItem, 'small-item'],
      [isShort, 'short-item'],
      [isNarrow, 'narrow-item'],
      [isVerticalContainer, 'vertical-item'],
      [isShowArrows, 'with-arrows'],
    ].filter(x => x[0])
      .map(x => x[1])
      .join(' ');

    return (
      <div
        className={'gallery-item-social gallery-item-direction-' + styleParams.galleryTextAlign + ' ' + classes}
        key={'item-social-' + id}
        data-hook="item-social"
        >
        {multishare}
        {loveButton}
        {download}
        {socialShare}
      </div>
    );
  }
}
