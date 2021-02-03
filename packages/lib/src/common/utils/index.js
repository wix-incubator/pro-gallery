import * as lodash from './lodash';
import window from '../window/windowWrapper';
import {
  isEditMode,
  isPreviewMode,
  isFormFactorMobile,
} from '../window/viewModeWrapper';

class Utils {
  constructor() {
    this._cache = {};
    this._hash2int = {};
    this._params = {};

    Object.assign(this, lodash);
  }

  shouldUseCache() {
    return !isEditMode() && !isPreviewMode() && !this.isSSR();
  }

  isUndefined(something) {
    return typeof something === 'undefined';
  }

  dumpCache() {
    this._cache = {};
  }

  getOrPutFromCache(fld, func) {
    if (!this.shouldUseCache()) {
      return func();
    }
    if (this._cache[fld] !== undefined) {
      return this._cache[fld];
    }
    this._cache[fld] = func();
    return this._cache[fld];
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
        // .replace ( "?", "" )
        // this is better, there might be a question mark inside
        .substr(1)
        .split('&')
        .forEach((item) => {
          tmp = item.split('=');
          if (tmp[0] === val) {
            result = decodeURIComponent(tmp[1]);
          }
        });

      if (!result) {
        // if the param was not found in the search, try decoding the path
        const query = decodeURIComponent(_location.pathname).split('?')[1];
        if (!query) {
          return '';
        }

        query.split('&').forEach((item) => {
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
          .replace(/\\["\\/bfnrtu]/g, '@')
          .replace(
            /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g,
            ']'
          )
          .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
      )
    ) {
      // this is a json
      try {
        return JSON.parse(stripedObj);
      } catch (e) {
        // console.error('Parse object error: Catched ', e);
      }
    }
    return stripedObj;
  }

  hashCode(str) {
    let hash = 0,
      i,
      chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  isMobileByProps() {
    const _isMobileByProps = () => {
      const deviceType = this.parseGetParam('deviceType') || window.deviceType;
      const isMobileViewer = this.parseGetParam('showMobileView') === 'true';
      const formFactorMobile = isFormFactorMobile();
      if (isMobileViewer) {
        return true;
      } else if (deviceType) {
        return String(deviceType).toLowerCase().indexOf('mobile') >= 0;
      } else if (formFactorMobile) {
        return formFactorMobile;
      } else {
        return undefined;
      }
    };

    return this.getOrPutFromCache('isMobileByProps', _isMobileByProps);
  }

  isUserAgentMobile() {
    try {
      const _isUserAgentMobile = () => {
        let check = false;
        (function (a) {
          if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|pixel|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
              a
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
              a.substr(0, 4)
            )
          ) {
            check = true;
          }
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
      };

      return this.getOrPutFromCache('isUserAgentMobile', _isUserAgentMobile);
    } catch (e) {
      return false;
    }
  }

  isMobile() {
    const _isMobile = () => {
      const isMobileByProps = this.isMobileByProps();
      const isUserAgentMobile = this.isUserAgentMobile();

      return this.isUndefined(isMobileByProps)
        ? isUserAgentMobile
        : isMobileByProps;
    };

    return this.getOrPutFromCache('isMobile', _isMobile);
  }

  isTest() {
    try {
      return window.isTest;
    } catch (e) {
      return false;
    }
  }

  isLocal() {
    try {
      const host = window.location.hostname;
      if (host === 'local.wix.com') {
        return true;
      }
      if (host.indexOf('localhost') >= 0) {
        return true;
      }
      if (this.parseGetParam('debug') === 'true') {
        return true;
      }
      return false;
    } catch (E) {
      return false;
    }
  }

  isDev() {
    return this.getOrPutFromCache('isDev', () => {
      return (
        this.shouldDebug('ph_local') ||
        (this.isOOI() && process.env.NODE_ENV === 'development') ||
        (this.safeLocalStorage() || {}).forceDevMode === 'true'
      );
    });
  }

  isVerbose() {
    return (
      !this.isTest() && (this.safeLocalStorage() || {}).forceDevMode === 'true'
    );
  }

  isStoreGallery() {
    return this.getOrPutFromCache('isStoreGallery', () => {
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

  // TODO : Replace with isPrerender mode
  isSSR() {
    return typeof global.window === 'undefined';
  }

  isOOI() {
    return (
      this.isSSR() ||
      (typeof top !== 'undefined' &&
        typeof self !== 'undefined' &&
        (top === self || self.location.origin.includes('editor.wix.com')))
    );
  }

  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.floor(Math.random() * 16) || 0;
      return c === 'x' ? r.toString(16) : c;
    });
  }

  isExternalUrl(url) {
    return /(^https?)|(^data)|(^blob)/.test(url);
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

  safeLocalStorage() {
    try {
      return localStorage ? localStorage : window; // TrackJS errors, function returning null
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
    return elementIdx || -1; // no tabIndex (tab will not focus on this item)
  }

  setStateAndLog(that, caller, state, callback) {
    if (this.isVerbose()) {
      console.log(`State Change Called (${caller})`, state);
      const oldState = { ...that.state };
      that.setState(state, () => {
        const newState = { ...that.state };
        const change = this.printableObjectsDiff(oldState, newState, 'state');
        if (Object.keys(change).length > 0) {
          console.log(`State Change Completed (${caller})`, change);
        }
        if (this.isFunction(callback)) {
          callback.bind(that)();
        }
      });
    } else {
      that.setState(state, () => {
        if (this.isFunction(callback)) {
          callback.bind(that)();
        }
      });
    }
  }

  printableObjectsDiff(obj1, obj2, prefix = '') {
    const _toString = (v) => {
      if (v === '') {
        v = "''";
      } else if (this.isUndefined(v)) {
        v = 'undefined';
      }
      return String(v);
    };

    const getInnerDiff = (_obj1, _obj2, _prefix, depth = 1) => {
      if (depth > 3) {
        return {};
      }
      const innerDiff = Object.entries(_obj1).reduce((res, [k, v]) => {
        if (!this.isEqual(v, _obj2[k])) {
          if (Array.isArray(_obj2[k])) {
            if (v.length !== _obj2[k].length) {
              res[k + '.length'] =
                '[' + v.length + '] => [' + _obj2[k].length + ']';
            }
            res = Object.assign(
              res,
              getInnerDiff(
                v,
                _obj2[k],
                (_prefix ? _prefix + '.' : '') + k,
                depth + 1
              )
            );
          } else if (typeof _obj2[k] === 'object') {
            res = Object.assign(
              res,
              getInnerDiff(
                v,
                _obj2[k],
                (_prefix ? _prefix + '.' : '') + k,
                depth + 1
              )
            );
          } else {
            res[(_prefix ? _prefix + '.' : '') + k] =
              _toString(v) + ' => ' + _toString(_obj2[k]);
          }
        }
        return res;
      }, {});
      return innerDiff;
    };

    return getInnerDiff(obj1, obj2, prefix, 1);
  }

  getScreenWidth() {
    if (isPreviewMode() && this.isMobile()) {
      // In editor preview-mode, the screen is still a desktop, but the viewport in which the preview mode renders us is only 320, so 'window.screen.width' returns a wrong value.
      return 320;
    }
    if (this.isTest()) {
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
    if (this.isTest()) {
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

  getWindowWidth() {
    try {
      return window.innerWidth || 980;
    } catch (e) {
      return 980;
    }
  }

  getMobileEnabledClick(action) {
    // todo: bring back this line before pushing to master
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
          .map((ele) => {
            const arr = ele.split('=');
            return arr[0] === name ? arr[1] || '' : '';
          })
          .join('');
      } catch (e) {
        this._cache.params[name] = false;
        // console.log('caught cross origin error');
        // comment to avoid 'block is empty' from linter
      }
    }
    return this._cache.params[name];
  }

  scrollTo(element, to, duration, isHorizontal, callback) {
    if (this.isMobile()) {
      duration = 0; // do not animate scroll on mobile (looks jumpy and buggy)
    }

    const easeInOutQuad = (currentTime, start, change, _duration) => {
      // t = current time
      // b = start value
      // c = change in value
      // d = _duration
      if (_duration === 0) {
        return change + start;
      }

      currentTime /= _duration / 2;
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

  formatColor(color) {
    const defaultColor = 'inherit';
    if (!color) {
      return defaultColor;
    }
    const colorStr = color.value ? color.value : color;
    const colorRegex = /(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^)]*\)/;
    const regexRes = colorRegex.exec(colorStr);
    const isValidColor = regexRes && regexRes[0];
    return isValidColor ? colorStr : defaultColor;
  }

  logPlaygroundLink(styles) {
    try {
      if (this.isVerbose()) {
        const stylesStr = Object.entries(styles)
          .filter(
            ([key, val]) =>
              typeof val !== 'object' &&
              String(key).indexOf('Expand') === -1 &&
              String(key).indexOf('Color') === -1
          )
          .map(([key, val]) => `${key}=${encodeURI(val)}`)
          .join('&');

        console.log(
          'Gallery Playground link:',
          `https://pro-gallery.surge.sh?${stylesStr}`
        );
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

export default new Utils();
