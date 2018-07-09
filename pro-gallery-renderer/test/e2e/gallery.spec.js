import {expect} from 'chai';
import GalleryDriver from '../drivers/pupDriver';
// import * as nock from 'nock';

describe('Gallery', () => {

  let driver;

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  afterEach(async () => {
    driver.closeGallery();
  });

  // it('renders default items', async () => {
  //   await driver.openGallery('Default');
  //   expect((await driver.find.items()).length).to.equal(50);
  // });

});

