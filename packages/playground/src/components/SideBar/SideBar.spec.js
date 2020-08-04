// import { GALLERY_CONSTS } from 'pro-gallery-lib';
import { expect } from 'chai';
import { galleryOptions } from 'pro-gallery-lib';
import { stylesList } from '../../constants/settings.js';

describe('styleParams - general', () => {

  it.only('should contain all style params in the sections list', () => {
    const missingOptions = stylesList.filter(sp => !galleryOptions[sp]).join(',');
    expect(missingOptions).to.equal('');
  });
})
