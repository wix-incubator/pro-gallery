import galleryOptions from './index.js';

const stylesSet = new Set([...Object.keys(galleryOptions)]);
const styleList = [];
stylesSet.forEach((style) => styleList.push(style));

export default styleList.reduce((obj, styleParam) => {
  const settingsData = galleryOptions[styleParam];

  return {
    ...obj,
    [styleParam]: settingsData,
  };
}, {});
