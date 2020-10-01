import sinon from 'sinon';

let helpers;
global.beforeAll(() => {
  //stubing isGalleryInViewport() for all tests (this function tries to access document properties)
  helpers = require('../../../src/components/gallery/proGallery/galleryHelpers.js');
    sinon.stub(helpers, 'isGalleryInViewport').callsFake(() => {
      return true;
    });
});

global.afterAll(() => {
  helpers.isGalleryInViewport.restore();
});
