import * as imageSdk from 'image-client-api/dist/imageClientSDK';

const getWixFilename = (url) =>
  url.replace('https://static.wixstatic.com/media/', '');

const allowWebp = (item, sharpParams, requiredWidth) => {
  const isImageSizeAvailable = !item.isDimensionless;
  const isThumb = sharpParams && sharpParams.blur > 0;
  const isPixelImage = requiredWidth === 1;
  // const hasWatermark = watermarkHelper.exists;
  return !isPixelImage && isImageSizeAvailable && !isThumb; // && !hasWatermark;
};

const resizeUrlImp = (
  item,
  originalUrl,
  resizeMethod,
  requiredWidth,
  requiredHeight,
  sharpParams,
  faces,
  allowWatermark,
  focalPoint
) => {
  // assign default parameters
  originalUrl = originalUrl || '';
  sharpParams = sharpParams || {};

  // calc default quality
  if (sharpParams.quality > 0) {
    //don't allow quality above 90 till we have proper UI indication
    sharpParams.quality = Math.min(90, sharpParams.quality);
  }

  const focalPointObj = { x: 50, y: 50 };
  if (focalPoint && focalPoint[0] >= 0 && focalPoint[1] >= 0) {
    focalPointObj.x = Math.round(focalPoint[0] * 100);
    focalPointObj.y = Math.round(focalPoint[1] * 100);
  }

  if (sharpParams.allowUsm === true && sharpParams.usm) {
    sharpParams.usm.usm_a = Math.min(
      5,
      Math.max(0, sharpParams.usm.usm_a || 0)
    );
    sharpParams.usm.usm_r = Math.min(
      128,
      Math.max(0, sharpParams.usm.usm_r || 0)
    ); //should be max 500 - but it's returning a 404
    sharpParams.usm.usm_t = Math.min(
      1,
      Math.max(0, sharpParams.usm.usm_t || 0)
    );
  } else {
    sharpParams.usm = {
      usm_a: 0,
      usm_r: 0,
      usm_t: 0,
    };
  }

  let resizer = () => {};
  if (resizeMethod === 'fit') {
    // function getScaleToFitImageURL(relativeUrl, sourceWidth, sourceHeight, targetWidth, targetHeight, options) {
    resizer = imageSdk.getScaleToFitImageURL;
  } else {
    // function getScaleToFillImageURL(relativeUrl, sourceWidth, sourceHeight, targetWidth, targetHeight, options) {
    resizer = imageSdk.getScaleToFillImageURL;
  }

  /**
   * the transform options
   * @typedef  {object}   ImageTransformOptions
   * @property {boolean}  [progressive]               image transform progressive
   * @property {number}   [quality]                   image transform quality
   * @property {string}   [watermark]                 image watermark id
   * @property {object}   [unsharpMask]               unsharpMask filter
   * @property {number}   [unsharpMask.radius]        unsharpMask radius
   * @property {number}   [unsharpMask.amount]        unsharpMask amount
   * @property {number}   [unsharpMask.threshold]     unsharpMask threshold
   */

  const options = {};
  if (sharpParams.quality > 0) {
    options.quality = sharpParams.quality;
  }
  if (sharpParams.blur > 0) {
    options.filters = {
      blur: sharpParams.blur,
    };
    //this is a hack to avoid using the imageClientSdk for blurry images. These have to stay EXACTLY the same between SSR and CSR
    return `${item.mediaUrl}/v1/fit/w_250,h_250,al_c,q_30,blur_30/${item.id}.jpg`;
  }
  if (focalPointObj) {
    options.focalPoint = focalPointObj;
  }
  if (sharpParams && sharpParams.usm) {
    options.unsharpMask = {
      radius: parseFloat(sharpParams.usm.usm_r),
      amount: parseFloat(sharpParams.usm.usm_a),
      threshold: parseFloat(sharpParams.usm.usm_t),
    };
  }

  const retUrl = resizer(
    getWixFilename(originalUrl),
    item.maxWidth,
    item.maxHeight,
    requiredWidth,
    requiredHeight,
    options
  );

  /*
      console.log('USING THE CLIENT IMAGE SDK! Resized the image: ', retUrl, 'Previuos url was: ', resizeUrlImp_manual(originalUrl, resizeMethod, requiredWidth, requiredHeight, sharpParams, faces, allowWatermark, focalPoint), 'parameters were: ', {
        originalUrl,
        resizeMethod,
        orgWidth: item.maxWidth,
        orgHeight: item.maxHeight,
        requiredWidth,
        requiredHeight,
        options
      });
 		*/
  return retUrl;
};

const resizeMediaUrl = (
  item,
  originalUrl,
  resizeMethod,
  requiredWidth,
  requiredHeight,
  sharpParams,
  faces = false,
  allowWatermark = false,
  focalPoint
) => {
  requiredWidth = Math.ceil(requiredWidth);
  requiredHeight = Math.ceil(requiredHeight);

  let url;
  if (resizeMethod === 'video') {
    url = originalUrl;
  } else if (
    requiredWidth >= item.maxWidth &&
    requiredHeight >= item.maxHeight
  ) {
    url = item.url;
  } else {
    url = resizeUrlImp(
      item,
      originalUrl,
      resizeMethod,
      requiredWidth,
      requiredHeight,
      sharpParams,
      faces,
      allowWatermark,
      focalPoint
    );
  }

  if (!allowWebp(item, sharpParams, requiredWidth)) {
    url = url.replace('webp', 'jpg');
  }
  return url;
};

export { resizeMediaUrl };
