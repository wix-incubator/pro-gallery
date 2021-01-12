// import { calcTargetItemSize } from './layoutHelper';

const formatValue = (val) => {
  if (Number(val) === parseInt(val)) {
    return Number(val);
  } else if (val === 'true') {
    return true;
  } else if (val === 'false') {
    return false;
  }
  if (val === 'undefined') {
    return undefined;
  } else {
    return String(val);
  }
};

export const getStyleParamsFromUrl = (fullUrl, styles) => {
  try {
    const queryParams = fullUrl.split('?').pop();

    const styleParamsFromUrl = queryParams
      .replace('?', '')
      .split('&')
      .map((styleParam) => styleParam.split('='))
      .reduce(
        (obj, [styleParam, value]) =>
          Object.assign(obj, { [styleParam]: formatValue(value) }),
        {}
      );

    const styleParams = {
      ...styles,
      ...styleParamsFromUrl,
      // targetItemSize: calcTargetItemSize(styles),
    };

    return styleParams;
  } catch (e) {
    return {};
  }
};

export default getStyleParamsFromUrl;
