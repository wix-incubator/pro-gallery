import React from 'react';
import {spy, expect} from 'chai';
import GalleryDriver from '../drivers/pupDriver';
const {Assertion} = require('chai');
const toMatchScreenshot = require('match-screenshot/chai');
Assertion.addMethod('toMatchScreenshot', toMatchScreenshot);

describe('Eyes layout tests', () => {

  let driver;

  beforeEach(() => {
    driver = new GalleryDriver();
    //driver.debug = true;
  });

  afterEach(async () => {
    driver.closeGallery();
  });

  it('Collage layout - Desktop', async () => {
    await driver.openGallery('Eyes', 'Collage');
    await expect(await driver.grab.screenshot()).toMatchScreenshot({key: 'Collage layout - Desktop', version: 'v1.0.1'});
  });

  it('Masonry layout - Desktop', async () => {
    await driver.openGallery('Eyes', 'Masonry');
    await expect(await driver.grab.screenshot()).toMatchScreenshot({key: 'Masonry layout - Desktop', version: 'v1.0.1'});
  });

  it('Grid 1 layout - Desktop', async () => {
    await driver.openGallery('Eyes', 'Grid 1');
    await expect(await driver.grab.screenshot()).toMatchScreenshot({key: 'Grid 1 layout - Desktop', version: 'v1.0.1'});
  });

  it('Grid 2 layout - Desktop', async () => {
    await driver.openGallery('Eyes', 'Grid 2');
    await expect(await driver.grab.screenshot()).toMatchScreenshot({key: 'Grid 2 layout - Desktop', version: 'v1.0.1'});
  });

  it('Grid 3 layout - Desktop', async () => {
    await driver.openGallery('Eyes', 'Grid 3');
    await expect(await driver.grab.screenshot()).toMatchScreenshot({key: 'Grid 3 layout - Desktop', version: 'v1.0.1'});
  });

  it('Thumbnails 1 layout - Desktop', async () => {
    await driver.openGallery('Eyes', 'Thumbnails 1');
    await expect(await driver.grab.screenshot()).toMatchScreenshot({key: 'Thumbnails 1 layout - Desktop', version: 'v1.0.1'});
  });

  it('Thumbnails 2 layout - Desktop', async () => {
    await driver.openGallery('Eyes', 'Thumbnails 2');
    await expect(await driver.grab.screenshot()).toMatchScreenshot({key: 'Thumbnails 2 layout - Desktop', version: 'v1.0.1'});
  });

  it('Slider layout - Desktop', async () => {
    await driver.openGallery('Eyes', 'Slider');
    await expect(await driver.grab.screenshot()).toMatchScreenshot({key: 'Slider layout - Desktop', version: 'v1.0.1'});
  });

  it('Slideshow layout - Desktop', async () => {
    await driver.openGallery('Eyes', 'Slideshow');
    await expect(await driver.grab.screenshot()).toMatchScreenshot({key: 'Slideshow layout - Desktop', version: 'v1.0.1'});
  });

  it('Strip layout - Desktop', async () => {
    await driver.openGallery('Eyes', 'Strip');
    await expect(await driver.grab.screenshot()).toMatchScreenshot({key: 'Strip layout - Desktop', version: 'v1.0.1'});
  });

  it('Collage layout - Android', async () => {
    await driver.openGallery('Eyes', 'Collage', 'Android');
    await expect(await driver.grab.screenshot()).toMatchScreenshot({key: 'Collage layout - Android', version: 'v1.0.1'});
  });

  it('Masonry layout - Android', async () => {
    await driver.openGallery('Eyes', 'Masonry', 'Android');
    await expect(await driver.grab.screenshot()).toMatchScreenshot({key: 'Masonry layout - Android', version: 'v1.0.1'});
  });

  it('Grid 1 layout - Android', async () => {
    await driver.openGallery('Eyes', 'Grid 1', 'Android');
    await expect(await driver.grab.screenshot()).toMatchScreenshot({key: 'Grid 1 layout - Android', version: 'v1.0.1'});
  });

  it('Grid 2 layout - Android', async () => {
    await driver.openGallery('Eyes', 'Grid 2', 'Android');
    await expect(await driver.grab.screenshot()).toMatchScreenshot({key: 'Grid 2 layout - Android', version: 'v1.0.1'});
  });

  it('Grid 3 layout - iPhone', async () => {
    await driver.openGallery('Eyes', 'Grid 3', 'iPhone');
    await expect(await driver.grab.screenshot()).toMatchScreenshot({key: 'Grid 3 layout - iPhone', version: 'v1.0.1'});
  });

  it('Thumbnails 1 layout - Android', async () => {
    await driver.openGallery('Eyes', 'Thumbnails 1', 'Android');
    await expect(await driver.grab.screenshot()).toMatchScreenshot({key: 'Thumbnails 1 layout - Android', version: 'v1.0.1'});
  });

  it('Thumbnails 2 layout - iPhone', async () => {
    await driver.openGallery('Eyes', 'Thumbnails 2', 'iPhone');
    await expect(await driver.grab.screenshot()).toMatchScreenshot({key: 'Thumbnails 2 layout - iPhone', version: 'v1.0.1'});
  });

  it('Slider layout - iPhone', async () => {
    await driver.openGallery('Eyes', 'Slider', 'iPhone');
    await expect(await driver.grab.screenshot()).toMatchScreenshot({key: 'Slider layout - iPhone', version: 'v1.0.1'});
  });

  it('Slideshow layout - iPhone', async () => {
    await driver.openGallery('Eyes', 'Slideshow', 'iPhone');
    await expect(await driver.grab.screenshot()).toMatchScreenshot({key: 'Slideshow layout - iPhone', version: 'v1.0.1'});
  });

  it('Strip layout - iPhone', async () => {
    await driver.openGallery('Eyes', 'Strip', 'iPhone');
    await expect(await driver.grab.screenshot()).toMatchScreenshot({key: 'Strip layout - iPhone', version: 'v1.0.1'});
  });
  it('Column layout - iPhone', async () => {
    await driver.openGallery('Gallery', 'Column');
    await driver.waitFor.timer(1000);
    await driver.actions.click('nav-arrow-next');
    await driver.waitFor.timer(1000);
    await expect(await driver.grab.screenshot()).toMatchScreenshot({key: 'Column layout after a click right', version: 'v1.0.1'});
  });
});
