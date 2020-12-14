import { createLayoutFixer } from 'pro-gallery';
import { createLayout } from 'pro-layouts';

const mediaUrlFixer = (existingUrl, newWidth, newHeight) => {
  const newUrl = existingUrl
    .replace(/w_\d*/, `w_${Math.round(newWidth)}`)
    .replace(/h_\d*/, `h_${Math.round(newHeight)}`);
  return newUrl;
};

const createLayoutPromise = params => {
  return new Promise(resolve => resolve(createLayout(params)))
}

createLayoutFixer(mediaUrlFixer, createLayoutPromise);
