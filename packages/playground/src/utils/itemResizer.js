/* eslint-disable no-debugger */
const WIX_MEDIA_PREFIX = 'https://static.wixstatic.com/media/';

const isExternalUrl = (url) => {
  const isFullUrl = /(^https?)|(^data)|(^blob)/.test(url);
  const isWixMedia = url.indexOf(WIX_MEDIA_PREFIX) === 0;
  const isResizePrevented = url.indexOf('preventResize') > 0;
  return isFullUrl && (!isWixMedia || isResizePrevented);
};

const prefixUrlIfNeeded = (originalUrl) => {
  if (isExternalUrl(originalUrl)) {
    return originalUrl;
  } else {
    return WIX_MEDIA_PREFIX + originalUrl;
  }
};

const removeResizeParams = (originalUrl) => {
  const isResizePrevented = originalUrl.indexOf('preventResize') >= 0;
  if (isResizePrevented) return originalUrl;
  originalUrl = originalUrl.replace(WIX_MEDIA_PREFIX, '');
  const resizingParamerterRegex = /(\/v\d\/(fill|fit|crop)\/(((w|h|x|y|scl|al|q)_[cf\d]*),?)*){1,}/;
  const resizingParametersPosition = resizingParamerterRegex.exec(originalUrl);
  if (resizingParametersPosition && resizingParametersPosition.index > 0) {
    return originalUrl.substr(0, resizingParametersPosition.index);
  } else {
    return originalUrl;
  }
};

const createResizedVideoUrl = ({ item, originalUrl, requiredHeight }) => {
  let videoUrl = originalUrl;

  if (item.qualities && item.qualities.length) {
    let suffix = '/';

    const mp4Qualities = item.qualities.filter(
      (video) => video.formats[0] === 'mp4',
    );
    // search for the first quality bigger that the required one
    if (
      mp4Qualities.length > 1 &&
      mp4Qualities[0].height > mp4Qualities[1].height
    ) {
      // some have reversed quality order. not sure how or when this happened
      mp4Qualities.reverse();
    }
    // eslint-disable-next-line no-cond-assign
    for (let quality, q = 0; (quality = mp4Qualities[q]); q++) {
      if (quality.height >= requiredHeight || !mp4Qualities[q + 1]) {
        suffix += quality.quality; // e.g. 720p
        // eslint-disable-next-line no-cond-assign
        for (let format, i = 0; (format = quality.formats[i]); i++) {
          videoUrl =
            window.location.protocol +
            '//video.wixstatic.com/video/' +
            item.url +
            suffix +
            '/' +
            format +
            '/file.' +
            format;
        }
        break;
      }
    }

    return videoUrl;
  }
};

const createResizedImageUrl = ({
  item,
  originalUrl,
  resizeMethod,
  requiredWidth,
  requiredHeight,
  sharpParams = {},
  focalPoint = [0.5, 0.5],
  useWebp = false,
  devicePixelRatio = 1,
}) => {
  const isTransparent = () => {
    return originalUrl.indexOf('.png') > 0 || originalUrl.indexOf('.gif') > 0;
  };

  const addSharpParams = () => {
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

    let retUrl = '';

    retUrl += ',q_' + sharpParams.quality;

    if (sharpParams.blur && !isTransparent()) {
      //the blur looks bad in pngs
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

    return retUrl;
  };

  const calcCropParams = () => {
    let scale;
    let x;
    let y;
    let orgW;
    let orgH;
    const requiredRatio = requiredWidth / requiredHeight;
    const itemRatio = item.maxWidth / item.maxHeight;

    // find the scale
    if (itemRatio > requiredRatio) {
      // wide image (relative to required ratio
      scale = requiredHeight / item.maxHeight;
      orgW = Math.floor(requiredHeight * itemRatio);
      y = 0;
      x = Math.round(orgW * focalPoint[0] - requiredWidth / 2);
      x = Math.min(orgW - requiredWidth, x);
      x = Math.max(0, x);
    } else {
      // narrow image

      scale = requiredWidth / item.maxWidth;
      orgH = Math.floor(requiredWidth / itemRatio);
      x = 0;
      y = Math.round(orgH * focalPoint[1] - requiredHeight / 2);
      y = Math.min(orgH - requiredHeight, y);
      y = Math.max(0, y);
    }

    // make sure scale is not lower than needed
    // scale must be higher to prevent cases that there will be white margins (or 404)
    scale = (Math.ceil(scale * 100) / 100).toFixed(2);

    return { x, y, scale };
  };

  const addResizeParams = () => {
    if (!focalPoint || focalPoint.every((f) => f === 0.5)) {
      resizeMethod = resizeMethod === 'fill' ? 'fill' : 'fit';
      if (requiredHeight <= 1 && requiredWidth <= 1) resizeMethod = 'fill';
      return `/v1/${resizeMethod}/w_${requiredWidth},h_${requiredHeight}`;
    } else {
      const { x, y, scale } = calcCropParams(
        item,
        requiredWidth,
        requiredHeight,
        focalPoint,
      );
      return `/v1/crop/w_${requiredWidth},h_${requiredHeight},x_${x},y_${y},scl_${scale}`;
    }
  };

  const addFilename = () => {
    return (
      '/' +
      (useWebp ? originalUrl.replace(/[^.]\w*$/, 'webp') : originalUrl).match(
        /[^/][\w.]*$/,
      )[0]
    );
  };

  requiredWidth = Math.ceil(requiredWidth * devicePixelRatio);
  requiredHeight = Math.ceil(requiredHeight * devicePixelRatio);

  let retUrl = prefixUrlIfNeeded(originalUrl);

  retUrl += addResizeParams();
  retUrl += addSharpParams();
  retUrl += addFilename();

  return retUrl;
};

const resizeMediaUrl = (
  item,
  originalUrl,
  resizeMethod,
  requiredWidth,
  requiredHeight,
  sharpParams,
  focalPoint,
  createMultiple,
  imageToken,
) => {
  const hasImageToken = item.dto.imageToken || item.dto.token || imageToken;

  originalUrl = removeResizeParams(originalUrl);

  const params = {
    item,
    originalUrl,
    resizeMethod,
    requiredWidth,
    requiredHeight,
    sharpParams,
    focalPoint,
  };
  if (resizeMethod === 'video') {
    return createResizedVideoUrl(params);
  } else if (isExternalUrl(originalUrl)) {
    return originalUrl;
  } else if (resizeMethod === 'full' && !hasImageToken) {
    return prefixUrlIfNeeded(originalUrl);
  } else if (createMultiple) {
    return [
      {
        type: originalUrl.match(/[^.]\w*$/)[0],
        url: createResizedImageUrl({
          ...params,
          useWebp: false,
          devicePixelRatio: 1,
        }),
        dpr: [1, 2]
          .map(
            (dpr) =>
              createResizedImageUrl({
                ...params,
                useWebp: false,
                devicePixelRatio: dpr,
              }) + ` ${dpr}x`,
          )
          .join(', '),
      },
      {
        type: 'webp',
        url: createResizedImageUrl({
          ...params,
          useWebp: true,
          devicePixelRatio: 1,
        }),
        dpr: [1, 2]
          .map(
            (dpr) =>
              createResizedImageUrl({
                ...params,
                useWebp: true,
                devicePixelRatio: dpr,
              }) + ` ${dpr}x`,
          )
          .join(', '),
      },
    ];
  } else {
    return createResizedImageUrl(params);
  }
};

export { resizeMediaUrl };