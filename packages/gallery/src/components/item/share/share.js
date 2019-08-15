import React from 'react';
import _ from 'lodash';
import utils from '../../../utils/index.js';
import { GalleryComponent } from '../../galleryComponent';
import { isSiteMode, isSEOMode } from '../../../utils/window/viewModeWrapper';
import EVENTS from '../../../utils/constants/events';

export default class Share extends GalleryComponent {
  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.getShareArr = this.getShareArr.bind(this);
    this.buttons = [];
    this.shareArr = this.getShareArr(this.props.type);
    this.state = {
      showShare: false,
      focusedShareIcon: 0,
    };
  }

  getShareArr(type) {
    return type === 'text'
      ? ['facebook', 'twitter', 'tumblr', 'email']
      : ['facebook', 'twitter', 'pinterest', 'tumblr', 'email'];
  }

  handleKeyDown(e, type) {
    if (this.state.showShare) {
      switch (e.keyCode || e.charCode) {
        case 38: //up
        case 37: //left
        case 33: //page up
          e.preventDefault();
          e.stopPropagation();
          utils.setStateAndLog(this, 'Share Keypress', {
            focusedShareIcon: Math.max(1, this.state.focusedShareIcon - 1),
          });
          return false;
        case 39: //right
        case 40: //down
        case 34: //page down
          e.preventDefault();
          e.stopPropagation();
          utils.setStateAndLog(this, 'Share Keypress', {
            focusedShareIcon: Math.min(
              type === 'text' ? 4 : 5,
              this.state.focusedShareIcon + 1,
            ),
          });
          return false;
        case 9: //tab
        case 27: //esc
          e.preventDefault();
          e.stopPropagation();
          this.props.actions.toggleShare(e, false);
          utils.setStateAndLog(this, 'Share Keypress', {
            showShare: false,
            focusedShareIcon: 0,
          });
          return false;
      }
    }

    switch (e.keyCode || e.charCode) {
      case 32: //space
      case 13: //enter
        e.preventDefault();
        e.stopPropagation();
        if (this.state.showShare) {
          const { allProps } = this.props;
          const shareData = {
            network: this.shareArr[this.state.focusedShareIcon - 1],
            shareProps: allProps,
          };
          this.props.actions.eventsListener(
            EVENTS.SHARE_BUTTON_CLICKED,
            shareData,
          );
          this.props.actions.toggleShare(e, false);
          utils.setStateAndLog(this, 'Share Keypress', {
            showShare: false,
            focusedShareIcon: 0,
          });
        } else {
          this.props.actions.toggleShare(e, true);
          utils.setStateAndLog(this, 'Share Keypress', {
            showShare: true,
            focusedShareIcon: 1,
          });
        }

        return false;
    }

    return true;
  }

  componentDidUpdate() {
    if (this.props.showShare && !this.state.showShare) {
      utils.setStateAndLog(this, 'props.showShare is true', {
        showShare: true,
      });
    } else if (!this.props.showShare && this.state.showShare) {
      utils.setStateAndLog(this, 'props.showShare is false', {
        showShare: false,
      });
    }
    try {
      if (
        (isSiteMode() || isSEOMode()) &&
        !utils.isMobile() &&
        window.document &&
        window.document.activeElement &&
        window.document.activeElement.className
      ) {
        const activeElement = window.document.activeElement;
        const isShareItemInFocus = () =>
          String(activeElement.className).indexOf('network-') >= 0;

        if (!this.state.showShare && isShareItemInFocus()) {
          this.socialShareBox.focus();
          return;
        }
      }
      const focusedButton = this.state.focusedShareIcon;
      if (focusedButton > 0) {
        this.buttons[focusedButton - 1].focus();
      }
    } catch (e) {
      console.warn('Cannot focus on share icon', this.props.focus, e);
    }
  }

  getShareItem(network, idx) {
    const { allProps } = this.props;
    const shareIconsNumber = this.shareArr.length;
    return (
      <button
        className={
          `block-fullscreen has-custom-focus network-${idx +
            1} progallery-svg-font-icons-` +
          network +
          (isSiteMode() || isSEOMode() ? '' : ' inactive ')
        }
        style={{
          top: this.props.isVerticalContainer
            ? `calc(100% / 6 * ${idx + 1} + -10px ${
                shareIconsNumber === 4 ? '+ 100% / 12' : ''
              })`
            : '',
          left: this.props.isVerticalContainer
            ? ''
            : `calc(100% / 6 * ${idx + 1} + -10px ${
                shareIconsNumber === 4 ? '+ 100% / 12' : ''
              })`,
        }}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          const shareData = {
            network,
            shareProps: allProps,
          };
          this.props.actions.eventsListener(
            EVENTS.SHARE_BUTTON_CLICKED,
            shareData,
          );
        }}
        data-hook={network + '-share-button'}
        ref={button => (this.buttons[idx] = button)}
        title={`Share on ${network}`}
        aria-label={`Share on ${network}, ${idx + 1} of ${
          this.shareArr.length
        }`}
        aria-live="assertive"
        role="button"
        tabIndex={-1}
        key={network + '-share-icon'}
      />
    );
  }

  render() {
    const {
      styleParams,
      id,
      isVerticalContainer,
      actions,
      style,
      type,
    } = this.props;

    if (styleParams.allowSocial) {
      const minDimension = 200;
      return (
        <div
          data-hook="social-share-box"
          className={
            'block-fullscreen gallery-item-social-share-box ' +
            (this.props.showShare ? ' opened ' : ' hidden ') +
            (this.state.showShare ? ' hovered ' : '') +
            (isVerticalContainer ? ' vertical-item ' : '')
          }
          ref={e => (this.socialShareBox = e)}
          onClick={e => actions.toggleShare(e, false)}
          onMouseOut={e => actions.toggleShare(e, false)}
          style={{
            transform: isVerticalContainer
              ? 'translateY(-50%) ' +
                (style.height > minDimension
                  ? ''
                  : 'scale(' + style.height / minDimension + ')')
              : 'translateX(-50%) ' +
                (style.width > minDimension
                  ? ''
                  : 'scale(' + style.width / minDimension + ')'),
          }}
          tabIndex={
            styleParams.isSlideshow && this.props.currentIdx === this.props.idx
              ? 0
              : -1
          }
          onKeyDown={e => this.handleKeyDown(e, type)}
          aria-label={'Share'}
          role="button"
          key={'item-social-share-container-' + id}
        >
          {_.map(this.shareArr, (network, i) => {
            return this.getShareItem(network, i);
          })}
        </div>
      );
    }
    return false;
  }
}
