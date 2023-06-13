// import { GALLERY_CONSTS } from 'pro-gallery-lib';
import { expect } from 'chai';
import { galleryOptions } from 'pro-gallery-lib';
import { optionsList } from '../../constants/settings.js';

describe('options - general', () => {
  it.skip('should contain all options in the sections list', () => {
    const missingOptions = optionsList.filter((sp) => !galleryOptions[sp]).join(',');
    expect(missingOptions).to.equal('');
  });
});
