'use strict';

import {exportAPI} from 'santa-platform-super-apps';
import {Wix} from 'photography-client-lib';

class GalleryWixCodeApi {

  constructor() {

    this.resetGalleryInEditor = this.resetGalleryInEditor.bind(this);

    this.compId = 'pro-gallery-no-comp-id';
    this.uniqueUuids = {};

    this.waitForWixSdk();
    this.resetGallery();

  }

  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.floor(Math.random() * 16) || 0;
      return (c === 'x' ? r.toString(16) : c);
    });
  }

  createUniqueUuidFromString(str, retry) {
    function hashToInt(str) {
      let hash = 0;

      if (typeof (str) === 'undefined' || str.length === 0) {
        return hash;
      }
      for (let i = 0; i < str.length; i++) {
        hash += str.charCodeAt(i);
      }
      return hash;
    }

    let num = hashToInt(str);
    num = num < 10000 ? Math.pow(num, 2) : num;

    const uuid = this.generateUUID();

    if (this.uniqueUuids[uuid] === true) {
      //unique uuid already exists!
      console.warn('Pro Gallery - unique uuid already exists', str, num, retry);
      if (typeof (retry) === 'undefined' || retry > 0) {
        return this.createUniqueUuidFromString(str + 'x', (retry || 3) - 1);
      } else {
        console.error('Pro Gallery - cannot create unique uuid', str, num);
        return uuid;
      }
    } else {
      this.uniqueUuids[uuid] = true;
      return uuid;
    }
  }

  waitForWixSdk() {
    this.wixSdkReadyInterval = setInterval(() => {
      if (window.Wix && Wix.Utils) {
        clearInterval(this.wixSdkReadyInterval);
        // console.log('proGallery Wix SDK is Ready!');
        this.onWixSdkReady();
      }
    }, 100);
  }

  onWixSdkReady() {
    //listen to editor/preview changes
    try {

      Wix.addEventListener(Wix.Events.EDIT_MODE_CHANGE, this.resetGalleryInEditor);
      this.compId = Wix.Utils.getCompId();

    } catch (e) {
      // console.warn('Cannot use wix sdk for wixCode', e);
    }


  }

  setClickCallback(callback) {
    if (typeof (callback) === 'function') {
      this.itemClickedCallbacks.push(callback);
    }
  }

  onItemClicked(itemProps) {
    //todo - pass a formatted item in the event
    for (let i = 0; i < this.itemClickedCallbacks.length; i++) {
      const callback = this.itemClickedCallbacks[i];
      if (typeof (callback) === 'function') {
        callback({
          compId: this.compId,
          event: {
            action: 'itemClicked',
            id: itemProps.id,
            imageIndex: itemProps.idx,
            item: {
              uri: itemProps.originalsUrl,
              description: (itemProps && itemProps.description),
              alt: (itemProps && itemProps.title),
              title: (itemProps && itemProps.title),
              height: (itemProps && itemProps.style && itemProps.style.height),
              width: (itemProps && itemProps.style && itemProps.style.width),
              link: (itemProps && itemProps.linkUrl),
              target: (itemProps && itemProps.linkOpenType)
            }
          }
        });
      }
    }
  }

  setItemChangedCallback(callback) {
    if (typeof (callback) === 'function') {
      this.itemChangedCallbacks.push(callback);
    }
  }

  onItemChanged(item) {
    //todo - pass a formatted item in the event
    for (let i = 0; i < this.itemChangedCallbacks.length; i++) {
      const callback = this.itemChangedCallbacks[i];
      if (typeof (callback) === 'function') {
        callback({
          compId: this.compId,
          event: {
            action: 'imageChanged',
            id: item.id,
            imageIndex: item.idx,
            item: this.formatItemsForWixCode([item])[0]
          }
        });
      }
    }
  }

  formatItemsForWixCode(itemsDto) {
    const formattedItemsDto = [];
    for (let itemDto, i = 0; itemDto = itemsDto[i]; i++) {
      formattedItemsDto.push({
        uri: itemDto.mediaUrl,
        description: (itemDto && itemDto.metaData && itemDto.metaData.description),
        alt: (itemDto && itemDto.metaData && itemDto.metaData.title),
        title: (itemDto && itemDto.metaData && itemDto.metaData.title),
        height: (itemDto && itemDto.metaData && itemDto.metaData.height),
        width: (itemDto && itemDto.metaData && itemDto.metaData.width),
        link: (itemDto && itemDto.metaData && itemDto.metaData.link)
      });
    }
    return formattedItemsDto;
  }

  formatItemsFromWixCode(wixCodeItems) {

    const formatLink = (link, target) => {
      switch (typeof (link)) {
        case 'object':
          return {
            type: 'wix',
            data: link
          };
        case 'string':
          return {
            type: 'web',
            url: link,
            target,
          };
        default:
          return {
            target: '_blank',
            type: 'none'
          };
      }
    };

    const formattedItemsDto = [];
    try {
      for (let wixCodeItem, i = 0; wixCodeItem = wixCodeItems[i]; i++) {
        formattedItemsDto.push({
          itemId: this.createUniqueUuidFromString(i + '_' + (wixCodeItem.uri || wixCodeItem.alt || i)),
          mediaUrl: wixCodeItem.uri || 'no_image.jpg',
          metaData: {
            height: wixCodeItem.height || 1,
            lastModified: Date.now(),
            link: formatLink(wixCodeItem.link, wixCodeItem.target),
            title: wixCodeItem.title || '',
            description: wixCodeItem.description || '',
            alt: wixCodeItem.alt || '',
            sourceName: 'private',
            tags: [],
            width: wixCodeItem.width || 1
          },
          orderIndex: i
        });
      }
    } catch (e) {
      // console.error('Wrong format for gallery items', wixCodeItems, e);
    }
    return formattedItemsDto;
  }

  resetGalleryInEditor() {
    if (window.Wix && Wix.Utils && Wix.Utils.getViewMode() === 'editor') {
      this.resetGallery();
    }
  }

  resetGallery() {
    if (this.originalGalleryItems && window.proGalleryServices) {
      window.proGalleryServices.setImages(this.originalGalleryItems);
    }

    this.itemClickedCallbacks = [];
    this.itemChangedCallbacks = [];
  }

  setItems(items) {
    if (window.proGalleryServices) {
      if (!this.originalGalleryItems) {
        this.originalGalleryItems = window.proGalleryServices.getItemsDto();
      }
      window.proGalleryServices.setImages(this.formatItemsFromWixCode(items));
      // console.log('proGallery setItems for WixCode (replaced rendered gallery items)');
    } else {
      if (!this.originalGalleryItems && window.prerenderedGallery && window.prerenderedGallery.items) {
        this.originalGalleryItems = window.prerenderedGallery.items;
      }
      //store the items until the proGalleryServices will be ready
      window.itemsFromWixCode = this.formatItemsFromWixCode(items);
      // console.log('proGallery setItems for WixCode (stored items for later render)');
    }
  }

  getItems() {
    if (window.proGalleryServices) {
      return this.formatItemsForWixCode(window.proGalleryServices.getItemsDto());
    } else {
      return [];
    }
  }

  generateApi() {
    return {
      getItems: () => this.getItems(),
      setItems: items => this.setItems(items),
      onItemClicked: callback => this.setClickCallback(callback),
      onCurrentItemChanged: callback => this.setItemChangedCallback(callback),
    };
  }
}

const galleryWixCodeApi = window.galleryWixCodeApi = new GalleryWixCodeApi();

try {
  exportAPI('publicApi', galleryWixCodeApi.generateApi());
  // console.log('proGallery WixCode exportAPI complete');
} catch (e) {
  // console.warn('Error in WixCode exportAPI ', e);
}

// try {
//   Wix.Performance.applicationLoaded(); //report application ready to wixCode
// } catch (e) {
//   console.warn('Error reporting applicationLoaded to wixCode', e);
// }
