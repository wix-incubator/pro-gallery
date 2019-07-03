import Wix from '@wix/photography-client-lib/dist/src/sdk/WixSdkWrapper';
import _ from 'lodash';
import window from './window/windowWrapper';

class Utils {
  constructor() {
    this._cache = {};
    this._hash2int = {};
    this._params = {};
    this._useCache = this.shouldUseCache();
    this.setIsWixMobile = this.setIsWixMobile.bind(this);
  }

  shouldUseCache() {
    let viewMode = true;
    try {
      viewMode =
        window &&
        window.Wix &&
        window.Wix.Utils &&
        window.Wix.Utils.getViewMode();
    } catch (e) {}
    if (this.isUndefined(viewMode)) {
      return true;
    }
    return viewMode !== 'editor' && viewMode !== 'preview';
  }

  isUndefined(something) {
    return typeof something === 'undefined';
  }

  getOrPutFromCache(fld, func) {
    //ignore cache in SSR (in ssr the module is kept alive between different renders) and in Editor and preview
    if (!this._useCache || this.isSSR()) {
      return func();
    }
    if (this._cache[fld] !== undefined) {
      return this._cache[fld];
    }
    this._cache[fld] = func();
    return this._cache[fld];
  }

  isDemo() {
    return this.parseGetParam('demo') === '1';
  }

  isInWix() {
    return (
      this.isTest() ||
      this.getOrPutFromCache('isInWix', () => {
        try {
          return (
            top !== self &&
            document.location.host === 'progallery.wix.com' &&
            document.location.search.indexOf('instance=') >= 0
          );
        } catch (e) {
          return false;
        }
      })
    );
  }

  isSemiNative() {
    try {
      return window.semiNative;
    } catch (e) {
      return false;
    }
  }

  hashToInt(str, min, max) {
    let int = 0;

    if (this.isUndefined(str) || str.length === 0) {
      return int;
    }

    if (!this._hash2int[str]) {
      for (let i = 0; i < str.length; i++) {
        int += str.charCodeAt(i);
      }
      this._hash2int[str] = int;
    }

    if (this.isUndefined(min) || this.isUndefined(max)) {
      return this._hash2int[str];
    } else {
      return (this._hash2int[str] % (max - min + 1)) + min;
    }
  }

  parseGetParam(val, url) {
    try {
      if (!this.isUndefined(this._params[val])) {
        return this._params[val];
      }

      let result = '',
        tmp = [];

      let _location = location;

      if (url) {
        _location = {
          search: '?' + (url.split('?')[1] || ''),
          pathname: (url.split('?')[0] || '').split('/')[1] || '',
        };
      }

      _location.search
        //.replace ( "?", "" )
        // this is better, there might be a question mark inside
        .substr(1)
        .split('&')
        .forEach(item => {
          tmp = item.split('=');
          if (tmp[0] === val) {
            result = decodeURIComponent(tmp[1]);
          }
        });

      if (!result) {
        //if the param was not found in the search, try decoding the path
        const query = decodeURIComponent(_location.pathname).split('?')[1];
        if (!query) {
          return '';
        }

        query.split('&').forEach(item => {
          tmp = item.split('=');
          if (tmp[0] === val) {
            result = decodeURIComponent(tmp[1]);
          }
        });
      }

      this._params[val] = result;

      return result;
    } catch (e) {
      return false;
    }
  }

  stripSlashes(str) {
    let newStr = '';
    if (typeof str === 'string') {
      newStr = str
        .replace(/\\\//g, '/')
        .replace(/\\'/g, "'")
        .replace(/\\"/g, '"')
        .replace(/\\0/g, '\0')
        .replace(/\\\\/g, '\\');
    }
    return newStr;
  }

  parseStringObject(sObj) {
    if (typeof sObj !== 'string') {
      return sObj;
    }

    const stripedObj = this.stripSlashes(sObj);
    if (
      typeof sObj === 'string' &&
      /^[\],:{}\s]*$/.test(
        stripedObj
          .replace(/\\["\\\/bfnrtu]/g, '@')
          .replace(
            /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
            ']',
          )
          .replace(/(?:^|:|,)(?:\s*\[)+/g, ''),
      )
    ) {
      //this is a json
      try {
        return JSON.parse(stripedObj);
      } catch (e) {
        // console.error('Parse object error: Catched ', e);
      }
    }
    return stripedObj;
  }

  isWixMobile() {
    const _isWixMobile = () => {
      const deviceType = this.parseGetParam('deviceType') || window.deviceType;
      const isMobileViewer = this.parseGetParam('showMobileView') === 'true';
      if (isMobileViewer) {
        return true;
      } else if (deviceType) {
        return (
          String(deviceType)
            .toLowerCase()
            .indexOf('mobile') >= 0
        );
      } else {
        return undefined;
      }
    };

    if (!this.isSite()) {
      return _isWixMobile();
    } else {
      return this.getOrPutFromCache('isWixMobile', _isWixMobile);
    }
  }

  isUserAgentMobile() {
    try {
      const _isUserAgentMobile = () => {
        let check = false;
        (function(a) {
          if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|pixel|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
              a,
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
              a.substr(0, 4),
            )
          ) {
            check = true;
          }
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
      };

      if (!this.isSite()) {
        return _isUserAgentMobile();
      } else {
        return this.getOrPutFromCache('isUserAgentMobile', _isUserAgentMobile);
      }
    } catch (e) {
      return false;
    }
  }

  setIsWixMobile(val) {
    window.deviceType = val ? 'mobile' : 'desktop';
    this._cache.isWixMobile = val;
    this._cache.isMobile = val;
  }

  isMobile() {
    const _isMobile = () => {
      const isWixMobile = this.isWixMobile();
      const isUserAgentMobile = this.isUserAgentMobile();

      return this.isUndefined(isWixMobile) ? isUserAgentMobile : isWixMobile;
    };

    if (this.isTest()) {
      return false;
    } else if (!this.isSite()) {
      return _isMobile();
    } else {
      return this.getOrPutFromCache('isMobile', _isMobile);
    }
  }

  isTest() {
    try {
      return window.isTest;
    } catch (e) {
      return false;
    }
  }

  isDev() {
    return this.getOrPutFromCache('isDev', () => {
      return (
        this.isLocal() ||
        (this.isOOI() && process.env.NODE_ENV === 'development') ||
        this.shouldDebug('ph_local') ||
        !!this.parseGetParam('debug') ||
        (this.safeLocalStorage() || {}).forceDevMode === 'true'
      );
    });
  }

  isVerbose() {
    return (
      !this.isTest() && (this.safeLocalStorage() || {}).forceDevMode === 'true'
    );
  }

  isLocal() {
    return this.getOrPutFromCache('isLocal', () => {
      const ipRegex = /([0-9]{1,3}\.){3}[0-9]{1,3}:[0-9]{1,5}/; //matches 111.222.333.444:9999
      const host = window.location.hostname || '';
      const isLocal =
        host === 'local.wix.com' ||
        host === '0.0.0.0' ||
        host.indexOf('localhost') >= 0 ||
        ipRegex.exec(host) !== null;
      return isLocal;
    });
  }

  isStoreGallery() {
    return this.getOrPutFromCache('isStoreGallery', () => {
      if (this.isSemiNative()) {
        return false;
      }

      try {
        return window.location.search.toLowerCase().indexOf('isstore') > -1;
      } catch (e) {
        if (this.isDev()) {
          console.error('cant find window', e);
        }
        return false;
      }
    });
  }

  isSSR() {
    return !!window.isMock;
  }

  isOOI() {
    return (
      this.isSSR() ||
      (typeof top !== 'undefined' &&
        typeof self !== 'undefined' &&
        (top === self || self.location.origin.includes('editor.wix.com')))
    );
  }

  updateViewMode(forceVal) {
    //NOTICE: this method must be called after each EDIT_MODE_CHANGED event to clear the cache
    if (typeof forceVal === 'string' && this.isOOI()) {
      this._cache.viewMode = forceVal.toLowerCase();
      return this._cache.viewMode;
    }
    try {
      if (
        window &&
        window.Wix &&
        window.Wix.Utils &&
        window.Wix.Utils.getViewMode
      ) {
        this._cache.viewMode = window.Wix.Utils.getViewMode();
        return this._cache.viewMode;
      }
    } catch (e) {
      return false;
    }
  }

  getViewModeFromCache() {
    return this.getOrPutFromCache('viewMode', () => {
      try {
        if (this.isOOI()) {
          //maybe should use !isInWix() instead isOOI(), but seems that isInWix() is not working good as well (it's using isTest but isTest is not good for OOI)
          if (this.isVerbose()) {
            console.warn(
              'OOI - viewMode not found, returning site if not in wix.com(old test)',
            );
          }
          try {
            return window.location.host.includes('wix.com')
              ? 'undefined'
              : 'site';
          } catch (e) {
            return 'undefined';
          }
        }
        if (this.isSSR()) {
          return 'site';
        }
        if (
          window &&
          window.Wix &&
          window.Wix.Utils &&
          window.Wix.Utils.getViewMode
        ) {
          return window.Wix.Utils.getViewMode();
        }
        return 'undefined';
      } catch (e) {
        return false;
      }
    });
  }

  isEditor() {
    //New OOI api
    if (this.isOOI()) {
      return this.getViewModeFromCache() === 'editor';
    }

    //Old iframe api
    if (!this.isInWix()) {
      return false;
    }
    return this.getViewModeFromCache() === 'editor';
  }

  isPreview() {
    //New OOI api
    if (this.isOOI()) {
      return this.getViewModeFromCache() === 'preview';
    }

    //Old iframe api
    if (!this.isInWix()) {
      return false;
    }
    return this.getViewModeFromCache() === 'preview';
  }

  isSite() {
    //New OOI api
    if (this.isOOI()) {
      return this.getViewModeFromCache() === 'site';
    }

    //Old iframe api
    return !this.isEditor() && !this.isPreview();
  }

  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.floor(Math.random() * 16) || 0;
      return c === 'x' ? r.toString(16) : c;
    });
  }

  isExternalUrl(url) {
    return /(^https?)|(^data)|(^blob)/.test(url);
  }

  isMobileViewer() {
    return this.getOrPutFromCache('isMobileViewer', () => {
      const isWixMobile = this.isWixMobile();
      const isUserAgentMobile = this.isUserAgentMobile();
      return isWixMobile && !isUserAgentMobile;
    });
  }

  isiOS() {
    return this.getOrPutFromCache('isiOS', () => {
      try {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      } catch (e) {
        return false;
      }
    });
  }

  isiPhone() {
    return this.getOrPutFromCache('isiPhone', () => {
      try {
        return /iPhone/.test(navigator.userAgent) && !window.MSStream;
      } catch (e) {
        return false;
      }
    });
  }

  isLandscape() {
    if (this.isSemiNative()) {
      return false;
    }
    return this.getOrPutFromCache('isLandscape', () => {
      if (!this.isMobile()) {
        return false;
      }
      try {
        if (!this.isUndefined(window.orientation)) {
          return window.orientation === 90 || window.orientation === -90;
        } else {
          const mql = window.matchMedia('(orientation: landscape)');
          if (mql && mql.matches === true) {
            return true;
          } else {
            return false;
          }
        }
      } catch (e) {
        return false;
      }
    });
  }

  isAccessibilityEnabled() {
    return this.getOrPutFromCache('isAccessibilityEnabled', () => {
      if (!this.isSite()) {
        return false;
      }
      const isDevAccessibility = this.shouldDebug('accessibility');
      if (this.isOOI() && window) {
        return isDevAccessibility || window.isAccessibilityEnabled;
      } else if (Wix && typeof Wix.isVisualFocusEnabled === 'function') {
        try {
          Wix.isVisualFocusEnabled(isIt => {
            return isIt || isDevAccessibility;
          });
        } catch (e) {
          //
        }
      }
      return isDevAccessibility;
    });
  }

  safeLocalStorage() {
    try {
      return localStorage ? localStorage : window; //TrackJS errors, function returning null
    } catch (e) {
      return window;
    }
  }

  shouldDebug(str) {
    try {
      return (
        !!this.safeLocalStorage()[str] ||
        (window.debugApp || '').indexOf(str) >= 0 ||
        (this.parseGetParam('debugApp') || '').indexOf(str) >= 0
      );
    } catch (e) {
      return false;
    }
  }

  deviceHasMemoryIssues() {
    return this.isiOS();
  }

  getTabIndex(elementName) {
    const elementsArr = [
      'currentGalleryItem',
      'loadMoreButton',
      'slideshowNext',
      'slideshowPrev',
      'currentThumbnail',
      'slideshowLove',
      'slideshowShare',

      'cartIcon',
      'cartClose',
      'cartFrame',

      'fullscreenClose',
      'fullscreenNext',
      'fullscreenPrev',
      'fullscreenInfo',
      // 'fullscreenTitle',
      // 'fullscreenDesc',
      'fullscreenLink',
      'fullscreenProvider',
      'fullscreenCartButton',
      'fullscreenCheckout',
      'fullscreenExpand',
      'fullscreenVideoPlay',
      'fullscreenVideoBar',
      'fullscreenVideoMute',
      'fullscreenVideoVolume',
      'fullscreenCartIcon',
      'fullscreenDownload',
      'fullscreenLove',
      'fullscreenShare',
    ];

    const elementIdx = elementsArr.indexOf(elementName) + 1;
    if (elementIdx >= 0 && this.isOOI()) {
      return 0;
    }
    return elementIdx || -1; //no tabIndex (tab will not focus on this item)
  }

  setStateAndLog(that, caller, state, callback) {
    if (this.isVerbose()) {
      console.log(`State Change Called (${caller})`, state);
      const oldState = _.clone(that.state);
      that.setState(state, () => {
        const newState = _.clone(that.state);
        const change = this.printableObjectsDiff(oldState, newState, 'state');
        if (_.keys(change).length > 0) {
          console.log(`State Change Completed (${caller})`, change);
        }
        if (_.isFunction(callback)) {
          callback.bind(that)();
        }
      });
    } else {
      that.setState(state, () => {
        if (_.isFunction(callback)) {
          callback.bind(that)();
        }
      });
    }
  }

  printableObjectsDiff(obj1, obj2, prefix = '') {
    const _toString = v => {
      if (v === '') {
        v = "''";
      } else if (this.isUndefined(v)) {
        v = 'undefined';
      }
      return _.toString(v);
    };

    const getInnerDiff = (obj1, obj2, prefix) => {
      const innerDiff = _.reduce(
        obj1,
        (res, v, k) => {
          if (!_.isEqual(v, obj2[k])) {
            if (_.isArray(obj2[k])) {
              if (v.length !== obj2[k].length) {
                res[k + '.length'] =
                  '[' + v.length + '] => [' + obj2[k].length + ']';
              }
              res = _.merge(
                res,
                getInnerDiff(v, obj2[k], (prefix ? prefix + '.' : '') + k),
              );
            } else if (_.isObject(obj2[k])) {
              res = _.merge(
                res,
                getInnerDiff(v, obj2[k], (prefix ? prefix + '.' : '') + k),
              );
            } else {
              res[(prefix ? prefix + '.' : '') + k] =
                _toString(v) + ' => ' + _toString(obj2[k]);
            }
          }
          return res;
        },
        {},
      );
      return innerDiff;
    };

    return getInnerDiff(obj1, obj2, prefix);
  }

  getScreenWidth() {
    if (this.isPreview() && this.isMobile()) {
      // In editor preview-mode, the screen is still a desktop, but the viewport in which the preview mode renders us is only 320, so 'window.screen.width' returns a wrong value.
      return 320;
    }
    if (this.isTest() || this.isSemiNative()) {
      return 1920;
    }
    try {
      if (this.isLandscape()) {
        return Math.max(window.screen.width, window.screen.height);
      } else {
        return window.screen.width;
      }
    } catch (e) {
      return 1920;
    }
  }

  getScreenHeight() {
    if (this.isTest() || this.isSemiNative()) {
      return 1200;
    }
    try {
      if (this.isLandscape()) {
        return Math.min(window.screen.width, window.screen.height);
      } else {
        return window.screen.height;
      }
    } catch (e) {
      return 1200;
    }
  }

  fixViewport() {
    if (this.isSemiNative() || !this.isInWix()) {
      return;
    }
    try {
      this._cache.isLandscape = undefined;
      if (this.isSite() && this.isMobile() && !this.isMobileViewer()) {
        //using isUserAgentMobile creates a bug in mobile view when configured to show desktop on mobile (so isWixMobile is false)
        const viewportAspectRatio = this.getViewportScaleRatio();
        window.document.body.style.transform =
          'scale(' + viewportAspectRatio + ')';
        window.document.body.style.transformOrigin = '0 0';
        window.document.body.style.width = 100 / viewportAspectRatio + '%';
        window.document.body.style.height = 100 / viewportAspectRatio + '%';
      }
    } catch (e) {
      return false;
    }
  }

  isLandscape() {
    if (this.isSemiNative()) {
      return false;
    }
    if (!this.isUndefined(this._cache.isLandscape)) {
      return this._cache.isLandscape;
    }
    if (!this.isMobile()) {
      this._cache.isLandscape = false;
    }
    try {
      if (!this.isUndefined(window.orientation)) {
        this._cache.isLandscape =
          window.orientation === 90 || window.orientation === -90;
      } else if (window.matchMedia) {
        const mql = window.matchMedia('(orientation: landscape)');
        if (mql && mql.matches === true) {
          this._cache.isLandscape = true;
        } else {
          this._cache.isLandscape = false;
        }
      } else {
        this._cache.isLandscape = false;
      }
    } catch (e) {
      this._cache.isLandscape = false;
    }
    return this._cache.isLandscape;
  }

  getDevicePixelRatio() {
    try {
      return (
        window.devicePixelRatio ||
        window.screen.deviceXDPI / window.screen.logicalXDPI
      ); // Support for IE10
    } catch (e) {
      return 1;
    }
  }

  getWindowWidth() {
    try {
      return window.innerWidth || 980;
    } catch (e) {
      return 980;
    }
  }

  getViewportScaleRatio() {
    //320 is a hack for wix - they have fixed viewport of 320 pixels regardlessof phone type
    const isGallery = typeof window !== 'undefined' && window.isGallery;
    const shouldIgnoreRatio = this.isiOS() && isGallery; // PHOT 917, this is a hack to get galleries back to their normal placement on iOS, w/o this galleries on iOS are smaller by the ratio returned here.
    if (
      !this.isOOI() &&
      this.isMobile() &&
      !this.isMobileViewer() &&
      this.isSite() &&
      !shouldIgnoreRatio
    ) {
      return 320 / this.getScreenWidth();
    } else {
      return 1;
    }
  }

  getMobileEnabledClick(action) {
    //todo: bring back this line before pushing to master
    return this.isMobile() ? { onTouchEnd: action } : { onClick: action };
    // return {onClick: action};
  }

  getTopUrlParam(name) {
    if (this.isUndefined(this._cache.params)) {
      this._cache.params = {};
    }
    if (this.isUndefined(this._cache.params[name])) {
      try {
        this._cache.params[name] = top.location.search
          .replace('?', '')
          .split('&')
          .map(ele => {
            const arr = ele.split('=');
            return arr[0] === name ? arr[1] || '' : '';
          })
          .join('');
      } catch (e) {
        this._cache.params[name] = false;
        // console.log('caught cross origin error');
        //comment to avoid 'block is empty' from linter
      }
    }
    return this._cache.params[name];
  }

  scrollTo(element, to, duration, isHorizontal, callback) {
    if (this.isMobile()) {
      duration = 0; //do not animate scroll on mobile (looks jumpy and buggy)
    }

    const easeInOutQuad = (currentTime, start, change, duration) => {
      //t = current time
      //b = start value
      //c = change in value
      //d = duration
      if (duration === 0) {
        return change + start;
      }

      currentTime /= duration / 2;
      if (currentTime < 1) {
        return (change / 2) * currentTime * currentTime + start;
      }
      currentTime--;
      return (-change / 2) * (currentTime * (currentTime - 2) - 1) + start;
    };

    const start = isHorizontal ? element.scrollLeft : element.scrollTop;
    const change = to - start;
    let currentTime = 0;
    const increment = 20;

    const animateScroll = () => {
      currentTime += increment;
      const val = easeInOutQuad(currentTime, start, change, duration);

      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      } else {
        element.setAttribute('data-scrolling', '');
        if (typeof callback === 'function') {
          callback();
        }
      }

      if (isHorizontal) {
        element.scrollLeft = val;
      } else {
        element.scrollTop = val;
      }
    };

    element.setAttribute('data-scrolling', 'true');
    animateScroll();
  }

  // isVerbose() {
  //   return window.isMock || (!this.isTest() && ((this.safeLocalStorage() || {}).forceDevMode === 'true'));
  // }
}

export default new Utils();
