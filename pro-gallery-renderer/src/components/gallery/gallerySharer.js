/// <reference path="../../reference.ts" />

import React from 'react';
import _ from 'lodash';
import {Wix, itemActions} from 'photography-client-lib';
import utils from '../../utils';
class GallerySharer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      items: [],
      itemsDOM: this.createItems([]),
      top: 0
    };

    this.height = this.width = 98;

    this.hashtag = '';
    this.shareButtons = [];

    itemActions.initWidgetData({
      toggleItemInMultishare: this.toggleItemInMultishare.bind(this),
      isMultisharing: this.isMultisharing.bind(this)
    });
  }

  toggleItemInMultishare(itemDto) {

    console.log('HASHTAG - Adding item', itemDto);

    let multishareItems = this.state.items.concat([itemDto]);

    multishareItems = _.uniqBy(multishareItems, item => item.itemId || item.photoId || item.url);

    console.log('New multishareItems', multishareItems);

    if (multishareItems && (multishareItems.length === 1) && (this.state.items.length === 0)) {
      this.createInitialHashtagIfNeeded(multishareItems);
      this.shareButtons = this.createShareButtonsIfNeeded(multishareItems);
    }

    $.ajax({
      url: `${utils.getApiUrlPrefix()}gallery/${window.galleryId}/items/${itemDto.itemId || itemDto.photoId}/hashtags`,
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      processData: false,
      data: JSON.stringify({
        hashTags: [this.hashtag]
      }),
      done: res => {
        console.log('HASHTAG - Added item', res);
      }
    });

    utils.setStateAndLog(this, 'HASHTAG - toggleItemInMultishare', {
      items: multishareItems,
      itemsDOM: this.createItems(multishareItems)
    });

  }

  removeItemFromMultishare(itemDto) {

    console.log('HASHTAG - Removing item', itemDto);

    $.ajax({
      url: `${utils.getApiUrlPrefix()}gallery/${window.galleryId}/items/${itemDto.itemId || itemDto.photoId}/hashtags`,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      processData: false,
      data: JSON.stringify({
        hashTags: [this.hashtag]
      }),
      done: res => {
        console.log('HASHTAG - Removed item', res);
      }
    });

    let multishareItems = this.state.items;

    multishareItems = _.filter(multishareItems, item => {
      return (
        (item.itemId || item.photoId) !== (itemDto.itemId || itemDto.photoId)
      );
    });

    utils.setStateAndLog(this, 'HASHTAG - removeItemFromMultishare', {
      items: multishareItems,
      itemsDOM: this.createItems(multishareItems)
    });
  }

  clearMultishareItems() {

    utils.setStateAndLog(this, 'clearMultishareItems', {
      items: [],
      itemsDOM: this.createItems([])
    });
  }

  isMultisharing() {
    return !!this.state.items.length;
  }


  createShareButtonsIfNeeded(items) {

    if (items.length === 0) {
      return [];
    }

    const shareButtons = [];

    const firstItem = items[0];
    firstItem.hashtag = this.hashtag;

    ['facebook', 'twitter', 'pinterest', 'tumblr', 'email'].forEach(network => {
      shareButtons.push(
        <i className={network + '-share progallery-svg-font-icons-' + network}
           onClick={() => itemActions.share(network, firstItem, 'multishare')}
           key={network + '-share-icon'}/>
      );
    });

    return shareButtons;
  }

  createInitialHashtagIfNeeded(newItems) {
    if (newItems.length === 1 && this.state.items.length === 0) {
      this.hashtag = 'HT' + utils.generateUUID();
      console.log('Created a new hashtag ', this.hashtag);
    }
    return this.hashtag;
  }

  getTextDimensions(item) {

    //text dimensions include scaling
    const transform = 'translate(0, 0) scale(' + ((item.style.width < (item.style.height + 1)) ? (this.height / item.style.maxHeight) : (this.width / item.style.maxWidth)) + ')';
    return {
      margin: (Math.floor((item.style.maxHeight - this.height) / -2)) + 'px ' + (Math.floor((item.style.maxWidth - this.width) / -2)) + 'px',
      width: item.style.maxWidth + 'px',
      height: item.style.maxHeight + 'px',
      WebkitTransform: transform,
      MsTransform: transform,
      OTransform: transform,
      transform,
    };

  }


  createItems(itemsDto) {

    const itemsDom = [];
    itemsDto.forEach(item => {
      itemsDom.push(
        item.type === 'text' ? (
          <div
            className="sharer-item"
            key={`sharer-item-${item.photoId || item.itemId}`}
            style={{
              backgroundColor: item.style.bgColor
            }}>
            <i className="sharer-item-x progallery-svg-font-icons-x"
               onClick={() => this.removeItemFromMultishare(item)} />
            <div dangerouslySetInnerHTML={{__html: item.html}} style={this.getTextDimensions(item)}/>
          </div>
        ) : (
          <div
            className="sharer-item"
            key={`sharer-item-${item.photoId || item.itemId}`}
          >
            <i className="sharer-item-x progallery-svg-font-icons-x"
               onClick={() => this.removeItemFromMultishare(item)}/>
            <img src={item.square_url.img} alt=""/>
          </div>
        )
      );
    });

    return itemsDom;
  }

  //-----------------------------------------| RENDER |--------------------------------------------//
  componentDidMount() {

  }

  componentWillReceiveProps(newProps) {

  }

  render() {
    const dom = !!this.state.items.length && (
        <div className="sharer-container">
          <div className="sharer-placeholder"/>
          <div className="sharer-floater" style={{
            top: this.state.top
          }}>
            <div className="sharer-wrapper">
              <i className="sharer-x progallery-svg-font-icons-x"
                 onClick={this.clearMultishareItems}/>
              <div className="sharer-icons">
                {this.shareButtons}
              </div>
              <div className="sharer-items">
                {this.state.itemsDOM}
              </div>
              <div className="clear"></div>
            </div>
          </div>
        </div>
      );

    Wix.PubSub.publish('multishare', {dom}, true);

    return false;
  }

}

export default GallerySharer;
