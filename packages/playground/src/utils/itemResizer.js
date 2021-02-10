
const WIX_MEDIA_PREFIX = 'https://static.wixstatic.com/media/';
const WIX_MEDIA_DOMAIN = '//static.wixstatic.com';

const isWixMediaUrl = (url) => url.indexOf(WIX_MEDIA_DOMAIN) >= 0;

const resizeUrlImp_manual = (
  item,
  originalUrl,
  resizeMethod,
  requiredWidth,
  requiredHeight,
  sharpParams,
  focalPoint,
  useWebp = false,
  devicePixelRatio = 1
) => {

  requiredWidth = Math.ceil(requiredWidth * devicePixelRatio);
  requiredHeight = Math.ceil(requiredHeight * devicePixelRatio);

  const requiredRatio = requiredWidth / requiredHeight;

  // assign sharp default parameters
  sharpParams = sharpParams || {};

  // calc default quality
  if (!sharpParams.quality) {
    sharpParams.quality = 90;
  }

  // don't allow quality above 90 till we have proper UI indication
  sharpParams.quality = Math.min(90, sharpParams.quality);

  if (sharpParams.allowUsm === true) {
    sharpParams.usm.usm_a = Math.min(
      5,
      Math.max(0, sharpParams.usm.usm_a || 0),
    );
    sharpParams.usm.usm_r = Math.min(
      128,
      Math.max(0, sharpParams.usm.usm_r || 0),
    ); // should be max 500 - but it's returning a 404
    sharpParams.usm.usm_t = Math.min(
      1,
      Math.max(0, sharpParams.usm.usm_t || 0),
    );
  }

  const focalPointObj = { x: 50, y: 50 };
  if (focalPoint && focalPoint[0] >= 0 && focalPoint[1] >= 0) {
    focalPointObj.x = Math.round(focalPoint[0] * 100);
    focalPointObj.y = Math.round(focalPoint[1] * 100);
  } else {
    focalPoint = [0.5, 0.5];
  }

  const isExternalUrl = (url) => {
    return /(^https?)|(^data)|(^blob)/.test(url);
  };


  const prefixUrlIfNeeded = (originalUrl) => {
    if (isExternalUrl(originalUrl)) {
      return originalUrl;
    } else {
      return WIX_MEDIA_PREFIX + originalUrl;
    }
  };

  if (isExternalUrl(originalUrl) && !isWixMediaUrl(originalUrl)) {
    return originalUrl;
  } else {
    let scale;
    let x;
    let y;
    let orgW;
    let orgH;
    let method;

    if (item.ratio > requiredRatio) {
      scale = requiredHeight / item.maxHeight;
    } else {
      scale = requiredWidth / item.maxWidth;
    }
    scale = (Math.ceil(scale * 100) / 100).toFixed(2);

    if (resizeMethod === 'fit') {
      method = 'fit';
      x = 0;
      y = 0;
    } else {
      method = 'crop';
      if (item.ratio > requiredRatio) {
        orgW = Math.floor(requiredHeight * item.ratio);
        y = 0;
        x = Math.round(orgW * focalPointObj.x- requiredWidth / 2);
        x = Math.min(orgW - requiredWidth, x);
        x = Math.max(0, x);
      } else {
        orgH = Math.floor(requiredWidth / item.ratio);
        x = 0;
        y = Math.round(orgH * focalPointObj.y- requiredHeight / 2);
        y = Math.min(orgH - requiredHeight, y);
        y = Math.max(0, y);
      }
    }

    let retUrl = prefixUrlIfNeeded(originalUrl) + '/v1/';
    retUrl += method + '/';
    retUrl += 'w_' + requiredWidth;
    retUrl += ',h_' + requiredHeight;
    retUrl += ',x_' + x;
    retUrl += ',y_' + y;
    retUrl += ',scl_' + scale;
    retUrl += ',q_' + sharpParams.quality;
    
    if (sharpParams.blur) {
      retUrl += ',blur_' + sharpParams.blur;
    }
    retUrl +=
      sharpParams.usm && sharpParams.usm.usm_r
        ? ',usm_' +
        sharpParams.usm.usm_r.toFixed(2) +
        '_' +
        sharpParams.usm.usm_a.toFixed(2) +
        '_' +
        sharpParams.usm.usm_t.toFixed(2)
        : '';
    // Important to use this as the last param
    retUrl +=
    '/' + (useWebp ? originalUrl.replace(/[^.]\w*$/, 'webp') : originalUrl).match(/[^/][\w.]*$/)[0];

    return retUrl;
  }
};

const resizeMediaUrl = (
  item,
  originalUrl,
  resizeMethod,
  requiredWidth,
  requiredHeight,
  sharpParams,
  focalPoint,
  createMultiple = false
) => {

  const params = [
    item,
    originalUrl,
    resizeMethod,
    requiredWidth,
    requiredHeight,
    sharpParams,
    focalPoint,
  ];

  if (resizeMethod === 'video') {
    return originalUrl;
  } else if (
    requiredWidth >= item.maxWidth &&
    requiredHeight >= item.maxHeight
  ) {
    return item.url;
  } else if (createMultiple) {
    return {
      webp: {
        x1: resizeUrlImp_manual(...params, true, 1),
        x2: resizeUrlImp_manual(...params, true, 2),
      },
      original: {
        type: originalUrl.match(/[^.]\w*$/)[0],
        x1: resizeUrlImp_manual(...params, false, 1),
        x2: resizeUrlImp_manual(...params, false, 2),
      }
    };
  } else {
    return resizeUrlImp_manual(...params);
  }
};

export { resizeMediaUrl };
