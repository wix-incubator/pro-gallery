import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

// Relevant to entire test suite (both 'describe's)
let driver;

describe('arrowsPosition with info below - e2e', () => {
  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterEach(async () => {
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });

  afterAll(async () => {
    await driver.closePage();
  });

  // gets info below relevant style params
  const getLayoutStylesByVerticalPosition = (arrowsVerticalPosition) => {
    return {
      galleryLayout: GALLERY_CONSTS.layout.SLIDER,
      titlePlacement: 'SHOW_BELOW',
      arrowsVerticalPosition: arrowsVerticalPosition,
    };
  };

  it('should have arrows on info center', async () => {
    const currentTestLayout = getLayoutStylesByVerticalPosition('INFO_CENTER');
    await driver.navigate(currentTestLayout);
  });

  it('should have arrows on item center', async () => {
    const currentTestLayout = getLayoutStylesByVerticalPosition('ITEM_CENTER');
    await driver.navigate(currentTestLayout);
  });

  it('should have arrows on image center', async () => {
    const currentTestLayout = getLayoutStylesByVerticalPosition('IMAGE_CENTER');
    await driver.navigate(currentTestLayout);
  });
});

describe('arrowsPosition with info above - e2e', () => {
  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterEach(async () => {
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });

  afterAll(async () => {
    await driver.closePage();
  });

  // gets info above relevant style params
  const getLayoutStylesByVerticalPosition = (arrowsVerticalPosition) => {
    return {
      galleryLayout: GALLERY_CONSTS.layout.SLIDER,
      titlePlacement: 'SHOW_ABOVE',
      arrowsVerticalPosition: arrowsVerticalPosition,
    };
  };

  it('should have arrows on info center', async () => {
    const currentTestLayout = getLayoutStylesByVerticalPosition('INFO_CENTER');
    await driver.navigate(currentTestLayout);
  });

  it('should have arrows on item center', async () => {
    const currentTestLayout = getLayoutStylesByVerticalPosition('ITEM_CENTER');
    await driver.navigate(currentTestLayout);
  });

  it('should have arrows on image center', async () => {
    const currentTestLayout = getLayoutStylesByVerticalPosition('IMAGE_CENTER');
    await driver.navigate(currentTestLayout);
  });
});
