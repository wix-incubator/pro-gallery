import * as _ from 'lodash';
import utils from '../utils';

class ItemActions {

  constructor(config) {
    this.isMultisharing = _.noop;
    this.wasInit = false;
    this.loveCounts = {};
    this.fetchSiteInfo();
    this.logger = config.logger;
  }

  initWidgetData(config) {

    this.config = config;

    if (config.compId) {
      this.compId = config.compId;
    }
    if (config.pageId) {
      this.pageId = config.pageId;
    }
    if (config.styleId) {
      this.styleId = config.styleId;
    }
    if (config.galleryId) {
      this.galleryId = config.galleryId;
    }
    if (config.fullscreenUrl) {
      this.siteUrl = this.fullscreenUrl = this.normalizeFullscreenUrl(config.fullscreenUrl);
      try {
        this.siteUrl = this.fullscreenUrl.match(/.*\..*\//g)[0];
      } catch (e) {
        //
      }
    }

    if (config.reachLevel) {
      this.setReachLevel(config.reachLevel);
    }

    if (this.galleryId && this.galleryId !== '') {
      this.loveCountFetched = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
      this.loveCountFetched.initCustomEvent('love_count_fetched', false, false, null);
      this.getStats();
    }

    this.wasInit = config;

    return Date.now();
    // console.log('itemActions initiated', config, window['proGalleryWidget']);
  }

  /**
   * Sometimes we may get a full screen url with some additional parameters (like we get right after the user logs in. We need to remove them)
   */
  normalizeFullscreenUrl(fullscreenUrl) {
    let querylessUrl = fullscreenUrl;
    if (fullscreenUrl) {
      querylessUrl = fullscreenUrl.split('?')[0];
    }
    return querylessUrl;
  }

  fetchSiteInfo() {
    if (utils.isInWix()) {
      this.siteInfo = {};
      Wix.getSiteInfo(res => {
        this.siteInfo = res;
      });
    } else {
      this.siteInfo = {
        url: utils.isSemiNative() ? '' : window.location.href,
        baseUrl: utils.isSemiNative() ? '' : window.location.href,
        siteTitle: 'Wix Pro Gallery',
        siteDescription: 'The best gallery any Wix user has ever seen!',
        siteKeywords: 'gallery,photos,photographer,professional'
      };
    }
  }

  getSiteUrl() {
    return this.siteInfo.url;
  }

  getStats() {
    if (utils.isDev()) {
      return;
    }
    if (!this.galleryId || this.galleryId == '' || this.galleryId.length < 10) {
      console.log('galleryId id', this.galleryId, typeof (this.galleryId));
      console.error('get stats error - no galleryId');
      return;
    }
    ($.get(`//progallery.wix.com/_api/pro-gallery-webapp/v1/gallery/${this.galleryId}/stats/properties`))
      .success(res => {
        try {
          this.statsProps = JSON.parse(res.properties);
          this.statsToken = res.statsToken;
        } catch (e) {
          console.error('Failed getting stats props', e);
        }
      });

    if (!window.instanceId) {
      console.warn('cannot report love counter - no instance id');
    } else {

      ($.get(`//progallery.wix.com/_api/pro-gallery-webapp/v1/gallery/${this.galleryId}/${window.instanceId}/stats`))
        .success(res => {
          try {
            this.loveCounts = (res.photoId2Love);
            window.dispatchEvent(this.loveCountFetched);
          } catch (e) {
            console.error('Failed getting love counts', e);
          }
        });
    }
  }

  getLoveCount(photoId) {
    return Math.max(0, this.loveCounts[photoId]) || 0;
  }

  html2img(itemDto, callback) {
    new Promise((resolve, reject) => {
      if (typeof window.html2canvas === 'undefined') {
        require(/* webpackChunkName: "html2canvas" */'html2canvas').then(html2canvas => {
          window.html2canvas = html2canvas;
          resolve();
        });
      } else {
        resolve();
      }
    }).then(() => {
      const div = $(itemDto.html)
          .addClass('html-element')
          .prependTo('body');

      window.html2canvas(div[div.length - 1], {
        onrendered(canvas) {
            // canvas is the final rendered <canvas> element
            //$(canvas).prependTo('body');
          div.remove();
          const url = canvas.toDataURL();
            //url = url.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
            //window.open(url);
            //console.log('Got Image from html', );
          if (typeof callback === 'function') {
            callback(url);
          }
        }
      });
    }
    );
  }

  share(type, itemDto, origin, numOfItems) {
    if (utils.isDemo()) {
      return;
    }
    this.logger.trackBi(this.logger.biEvents.share, {origin, platform: type});
    if (numOfItems) { //itemDto.numOfItems is not extensible because it is being passed in props. only for multishare
      itemDto.numOfItems = numOfItems;
    }
    this.shareImp(type, itemDto);
  }

  downloadTextItem(itemDto, origin) {
    this.logger.trackBi(this.logger.biEvents.download, {origin});
    this.html2img(itemDto, url => {
      url = url.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
      window.open(url);
    });
  }

  getReachLevel(increment) {
    const inc = Number(increment || 0);
    let rl;
    if (_.isUndefined(this.reachLevel)) {
      const ls = utils.getLocalStorage();
      rl = Number(ls[`${this.siteUrl}|reach-level`] || 0) + inc;
    } else {
      rl = this.reachLevel + inc;
    }
    return rl;
  }

  setReachLevel(rl, hashtag) {
    if (!(rl > 0)) {
      rl = 0;
    }
    try {
      const origRl = this.getReachLevel(0); //if this user already registered a reach-level for this site (already saw it) don't register again
      if (rl > 0 && origRl == 0 && _.isUndefined(this.reachLevel)) {
        this.logger.track('log_reach_level', {
          hashtag,
          reach_level: rl,
        });
        const ls = utils.getLocalStorage();
        ls[`${this.siteUrl}|reach-level`] = rl;
        this.reachLevel = rl;
      }
    } catch (e) {
      console.warn('set reach level error', e);
    }
  }

  getShareUrl(item) {
    return this.fullscreenUrl + '/' + this.compId + '/' + (item.id || item.photoId || item.itemId) + '/' + item.idx + '/' + encodeURIComponent('?i=' + item.idx + '&p=' + this.pageId + '&s=' + this.styleId + '&rl=' + this.getReachLevel(1) + (item.hashtag ? ('&ht=' + item.hashtag) : ''));
  }

  shareImp(type, itemDto, callback) {

    function openWindow(url, source) {
      if (utils.isiOS() && (source == 'Email')) {
        window.location.href = url;
      } else {
        const windowRef = window.open(url, source + ' Share', 'height=640,width=960,toolbar=no,menubar=no,scrollbars=no,location=no,status=no');
        setTimeout(
          // When the mailto url opens. In some configurations the new window redirects to the configured mail client (e.g. gmail).
          // In other instances a desktop client is opened (e.g. Outlook) and the new window is blank. This tests for that situation and closes the window if it happens.
          () => {
            try {
              if (source == 'Email' && windowRef.location.hasOwnProperty('pathname') && windowRef.location.pathname == 'blank') {
                windowRef.close();
              }
            } catch (e) {
              console.warn('Could not close mailto window');
            }
          },
          5000
        );
      }
    }

    const item = {
      id: (itemDto.id || itemDto.photoId || itemDto.itemId),
      idx: (itemDto.idx || 0),
      url: (itemDto.full_url && itemDto.full_url.img),
      title: (itemDto.title || itemDto.description || this.siteInfo.siteTitle),
      hashtag: itemDto.hashtag
    };

    // console.log('itemActions init data', this.config, window['proGalleryWidget']);

    const shareUrl = encodeURIComponent(this.getShareUrl(item));
    const shareTitle = encodeURIComponent(item.title);
    const shareImageUrl = encodeURIComponent(item.url);

    const shareKeywords = encodeURIComponent(this.siteInfo.siteKeywords);

    const shareMessage = encodeURIComponent(`${this.getShareUrl(item)}`);

    if (!_.isFunction(callback)) {
      callback = openWindow;
    }

    switch (type) {
      case 'facebook':
        callback('http://www.facebook.com/sharer/sharer.php?u=' + shareUrl + '&t=' + shareTitle, 'Facebook');
        break;
      case 'twitter':
        var twitterMaxLength = 110;
        var shareUrlExtraData = '&amp;text=' + (shareTitle === 'undefined' ? '' : shareTitle);
        if (shareUrlExtraData.length > twitterMaxLength) {
          shareUrlExtraData = shareUrlExtraData.slice(0, twitterMaxLength - 3) + '...';
        } else {
          const shareKeywordsUrlComponent = '&amp;hashtags=' + shareKeywords;
          if ((shareUrlExtraData + shareKeywordsUrlComponent).length <= twitterMaxLength) {
            shareUrlExtraData += shareKeywordsUrlComponent;
          }
        }
        callback('https://twitter.com/intent/tweet?url=' + shareUrl + shareUrlExtraData, 'Twitter');
        break;
      case 'pinterest':
        callback('https://pinterest.com/pin/create/button/?url=' + shareUrl + '&media=' + shareImageUrl + '&description=' + shareTitle, 'Pinterest');
        break;
      case 'google':
        callback('https://plus.google.com/share?url=' + shareUrl, 'Google Plus');
        break;
      case 'tumblr':
        callback('http://www.tumblr.com/share/link?url=' + shareUrl, 'Tumblr');
        break;
      case 'email':
        callback('mailto:?Subject=' + shareTitle + '&body=' + shareMessage, 'Email');
        break;
    }
  }

  reportLoveToStats(photoId, value) {
    try {

      if (!this.statsProps || !this.statsProps.instance_id) {
        this.getStats();
        return;
      }

      const statsProps = _.merge(this.statsProps, {photo_id: photoId});
      const statsToken = this.statsToken || window.statsToken;

      const uniqueUUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });

      $.ajax({
        url: window.location.protocol + '//photographers-counters.wix.com/collector/rest/collect-js?ctToken=' + statsToken,
        type: 'post',
        data: JSON.stringify({
          messageId: uniqueUUID,
          metrics: [
            {
              type: 'photo',
              reportMetrics: [
                {
                  name: 'love',
                  value: String(value)
                }
              ],
              properties: statsProps
            }
          ]
        }),
        contentType: 'application/json',
        dataType: 'json',
        success(data) {
          console.log('Success report love', data);
        }
      });

    } catch (e) {
      console.error('Error reporting love to stats', e);
    }

  }

  getLoveStorageKey(photoId) {
    return ('pro-gallery-item-love-' + photoId);
  }

  isLoved(photoId) {
    try {
      if (typeof localStorage === 'undefined') {
        return false;
      }
      return (!!localStorage[this.getLoveStorageKey(photoId)] || false);
    } catch (e) {
      console.warn('isLoved failed', e);
    }
  }

  toggleLove(photoId, origin, forceVal) {
    try {
      if (!localStorage) {
        return false;
      }
      let inc;
      if ((this.isLoved(photoId) && forceVal !== true) || forceVal === false) {
        // unlove
        localStorage[this.getLoveStorageKey(photoId)] = '';
        inc = -1;
      } else {
        //love
        this.logger.trackBi(this.logger.biEvents.love, {origin});
        localStorage[this.getLoveStorageKey(photoId)] = true;
        inc = 1;
      }
      this.reportLoveToStats(photoId, inc);
    } catch (e) {
      console.warn('toggleLove failed', e);
    }
  }

  isFirstLoveClick(photoId) {
    try {
      return (localStorage && localStorage[this.getLoveStorageKey(photoId)] === undefined);
    } catch (e) {
      console.warn('isFirstLoveClick failed', e);
    }
  }

  postLoveActivity(item) {

    const postSocialTrackActivity = data => {
      try {
        const activity = {
          type: Wix.Activities.Type.SOCIAL_TRACK,
          info: {
            type: data.activityType,
            channel: data.activityNetwork,
            itemInfo: {
              itemUrl: data.url,
              itemId: data.id,
              itemType: data.type.toUpperCase()
            }
          },
          details: {
            additionalInfoUrl: data.url,
            summary: ''
          },
          contactUpdate: null
        };

        const onSuccess = d => {
          console.log('Activity ID: ' + d.activityId + ', Contact ID: ' + d.contactId);
        };
        const onFailure = d => {
          console.log('Failure message:', d);
        };

        Wix.Activities.postActivity(activity, onSuccess, onFailure);
      } catch (e) {
        console.log('error posting activity.', e);
      }
    };

    if (this.isFirstLoveClick(item.photoId)) {
      postSocialTrackActivity({
        activityType: 'LOVE',
        activityNetwork: 'SITE',
        id: item.photoId,
        url: this.getShareUrl(item),
        type: item.type
      });
    }

  }

  showTooltip(e, text, pos) {

    if ($('.pro-tooltip').length >= 1) {
      return;
    }

    const target = $(e.currentTarget);

    if (!target) {
      return;
    }

    const offset = target.offset();
    const top = offset.top;
    const left = offset.left;

    let css;

    if (typeof (pos) === 'undefined') {
      pos = (left > (window.innerWidth / 2)) ? 'right' : 'left';
    }

    switch (pos) {
      case 'top':
        css = {
          top: top - 30,
          left: left + 28,
          opacity: 1
        };
        break;
      case 'right':
        css = {
          top: top - 4,
          left: left - 20,
          opacity: 1
        };

        break;
      case 'left':
        css = {
          top: top - 4,
          left: left + 40,
          opacity: 1
        };
        break;
    }
    css['pointer-events'] = 'none';

    ($('<div></div>'))
      .html(text)
      .addClass('pro-tooltip')
      .appendTo('body')
      .css(css)
      .addClass(pos);
  }

  hideTooltip() {
    $('.pro-tooltip')
      .remove();
  }

  toggleTooltip(e, text, pos) {
    const hasTooltip = ($('.pro-tooltip').length == 1);
    if (hasTooltip) {
      this.hideTooltip();
    } else {
      this.showTooltip(e, text, pos);
    }
  }

  viewClassName(layout, device) {
    if (layout == 'fullscreen') {
      return (device == 'desktop' ? 'fullscreen-icon' : '');
    } else {
      return '';
    }
  }
}

export const itemActions = new ItemActions();
