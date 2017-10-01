class BaseUtils {
  /* @ngInject */
  constructor() {
    this._cache = {};
    this._hash2int = {};
    this._params = {};
  }
  
  isUndefined(something) {
    return typeof something === 'undefined';
  }
  getOrPutFromCache(fld, func) {
    if (this._cache[fld] !== undefined) {
      return this._cache[fld];
    }
    this._cache[fld] = func();
    return this._cache[fld];
  }

  isInWix() {
    return this.getOrPutFromCache('isInWix', () => {
      return ((top !== self) && (document.location.search.indexOf('instance=') >= 0));
    });
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

    if (!this.isUndefined(this._params[val])) {
      return this._params[val];
    }

    let result = '',
      tmp = [];

    let _location = location;

    if (url) {
      _location = {
        search: '?' + (url.split('?')[1] || ''),
        pathname: ((url.split('?')[0] || '').split('/')[1] || '')
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

      query
        .split('&')
        .forEach(item => {
          tmp = item.split('=');
          if (tmp[0] === val) {
            result = decodeURIComponent(tmp[1]);
          }
        });
    }

    this._params[val] = result;

    return result;
  }

  isWixMobile() {
    const _isWixMobile = () => {
      const deviceType = this.parseGetParam('deviceType');
      if (deviceType) {
        return (String(deviceType).indexOf('mobile') >= 0);
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

    const _isUserAgentMobile = () => {
      let check = false;
      (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|pixel|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
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
  }

  isMobile() {
    const _isMobile = () => {
      const isWixMobile = this.isWixMobile();
      const isUserAgentMobile = this.isUserAgentMobile();

      return (this.isUndefined(isWixMobile) ? isUserAgentMobile : isWixMobile);
    };

    if (!this.isSite()) {
      return _isMobile();
    } else {
      return this.getOrPutFromCache('isMobile', _isMobile);
    }
  }

  isTest() {
    //the test driver will override this method to set it to true;
    return false;
  }

  isDev() {

    const ipRegex = /([0-9]{1,3}\.){3}[0-9]{1,3}:[0-9]{1,5}/; //matches 111.222.333.444:9999
    let isDev = this.isLocal();

    if (!this.isUndefined(this._cache.isDev)) {
      return this._cache.isDev;
    }

    isDev = isDev || (this.shouldDebug('ph_local'));
    isDev = isDev || (this.parseGetParam('debug') === 'true');
    isDev = isDev || ((this.safeLocalStorage() || {}).forceDevMode === 'true');
    this._cache.isDev = isDev;
    return isDev;
  }

  isVerbose() {
    return ((this.safeLocalStorage() || {}).forceDevMode === 'true');
  }

  isLocal() {
    const ipRegex = /([0-9]{1,3}\.){3}[0-9]{1,3}:[0-9]{1,5}/; //matches 111.222.333.444:9999

    if (!this.isUndefined(this._cache.isLocal)) {
      return this._cache.isLocal;
    }
    const host = window.location.hostname;
    const isLocal =
      host === 'local.wix.com' ||
      host === '0.0.0.0' ||
      host.indexOf('localhost') >= 0 ||
      ipRegex.exec(host) !== null;
    this._cache.isLocal = isLocal;
    return isLocal;
  }

  getViewModeFromCache() {
    return this.getOrPutFromCache('viewMode', () => {
      try {
        return Wix && Wix.Utils && Wix.Utils.getViewMode();
      } catch (e) {
        return false;
      }
    });
  }

  isEditor() {
    if (!this.isInWix()) {
      return false;
    }
    return (this.getViewModeFromCache() === 'editor');
  }

  isPreview() {
    if (!this.isInWix()) {
      return false;
    }
    return (this.getViewModeFromCache() === 'preview');
  }

  isSite() {
    return !this.isEditor() && !this.isPreview();
  }

  safeLocalStorage() {
    try {
      return localStorage;
    } catch (e) {
      return window;
    }
  }

  shouldDebug(str) {
    try {
      return (
        (!!this.safeLocalStorage()[str]) ||
        (window.debugApp || '').indexOf(str) >= 0 ||
        (this.parseGetParam('debugApp') || '').indexOf(str) >= 0
      );
    } catch (e) {
      return false;
    }
  }

  shouldLog(str) {
    return this.shouldDebug('ph_log_' + str);
  }

}

export const utils = new BaseUtils();

if (process.env.NODE_ENV === 'development') {
  window.baseUtils = baseUtils;
}
