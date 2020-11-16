import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('groupSize - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll( async() => {
    await driver.closePage();
  });
  it('should have max group size of 3 (groupSize=3)', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      collageDensity: 0.8,
      groupSize: 3,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    // expect to have groups of max 3
    expect(page).toMatchImageSnapshot();
  });
  it('should have max group size of 1 (groupSize=1)', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      collageDensity: 0.8,
      groupSize: 1,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    // expect to have groups of 1
    expect(page).toMatchImageSnapshot();
  });
  it('should have groups of 1 item (restricted by collageDensity)', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      collageDensity: 0,
      groupSize: 3,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    //expect to have groups of 1 despite groupSize = 3 (because of collageDensity)
    expect(page).toMatchImageSnapshot();
  });
  it('should have groups of 1 item (restricted by groupsPerStrip)', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      groupsPerStrip: 1,
      gridStyle: 1,
      groupSize: 3,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.partialScreenshot();
    //expect to have groups of 1 despite groupSize = 3 (because of collageDensity)
    expect(page).toMatchImageSnapshot();
  });
})
