import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

// Relevant to entire test suite (both 'describe's)
let driver;

// gets relevant layout style params
const getLayoutStylesByVerticalPosition = (
  titlePlacement,
  arrowsVerticalPosition
) => {
  return {
    galleryLayout: GALLERY_CONSTS.layout.SLIDER,
    titlePlacement: titlePlacement,
    arrowsVerticalPosition: arrowsVerticalPosition,
  };
};

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

  it('should have arrows on info center', async () => {
    const currentTestLayout = getLayoutStylesByVerticalPosition(
      'SHOW_BELOW',
      'INFO_CENTER'
    );
    await driver.navigate(currentTestLayout);
  });

  it('should have arrows on item center', async () => {
    const currentTestLayout = getLayoutStylesByVerticalPosition(
      'SHOW_BELOW',
      'ITEM_CENTER'
    );
    await driver.navigate(currentTestLayout);
  });

  it('should have arrows on image center', async () => {
    const currentTestLayout = getLayoutStylesByVerticalPosition(
      'SHOW_BELOW',
      'IMAGE_CENTER'
    );
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

  it('should have arrows on info center', async () => {
    const currentTestLayout = getLayoutStylesByVerticalPosition(
      'SHOW_ABOVE',
      'INFO_CENTER'
    );
    await driver.navigate(currentTestLayout);
  });

  it('should have arrows on item center', async () => {
    const currentTestLayout = getLayoutStylesByVerticalPosition(
      'SHOW_ABOVE',
      'ITEM_CENTER'
    );
    await driver.navigate(currentTestLayout);
  });

  it('should have arrows on image center', async () => {
    const currentTestLayout = getLayoutStylesByVerticalPosition(
      'SHOW_ABOVE',
      'IMAGE_CENTER'
    );
    await driver.navigate(currentTestLayout);
  });
});
