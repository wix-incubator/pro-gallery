import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

// gets relevant layout style params
const getLayoutStylesByVerticalPosition = (
  titlePlacement,
  arrowsVerticalPosition
) => {
  return {
    galleryLayout: GALLERY_CONSTS.layout.SLIDER,
    cubeImages: true,
    titlePlacement: titlePlacement,
    arrowsSize: 60,
    arrowsVerticalPosition: arrowsVerticalPosition,
  };
};

// This test needs to be more sensitive than what defined in matchers.js since changes are minor
const testsSensitivityConfig = {
  failureThreshold: 0,
  failureThresholdType: 'pixel',
};

// Grabbing page's snapshot and comparing to baseline
async function grabSnapshotAndCompare() {
  await driver.waitFor.hookToBeVisible('item-container');
  const page = await driver.grab.elemScreenshot('.pro-gallery');
  expect(page).toMatchImageSnapshot(testsSensitivityConfig);
}

// Relevant to entire test suite (both 'describe's)
let driver;

describe('arrowsPosition with info below - e2e', () => {
  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
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
    await grabSnapshotAndCompare();
  });

  it('should have arrows on item center', async () => {
    const currentTestLayout = getLayoutStylesByVerticalPosition(
      'SHOW_BELOW',
      'ITEM_CENTER'
    );
    await driver.navigate(currentTestLayout);
    await grabSnapshotAndCompare();
  });

  it('should have arrows on image center', async () => {
    const currentTestLayout = getLayoutStylesByVerticalPosition(
      'SHOW_BELOW',
      'IMAGE_CENTER'
    );
    await driver.navigate(currentTestLayout);
    await grabSnapshotAndCompare();
  });
});

describe('arrowsPosition with info above - e2e', () => {
  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
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
    await grabSnapshotAndCompare();
  });

  it('should have arrows on item center', async () => {
    const currentTestLayout = getLayoutStylesByVerticalPosition(
      'SHOW_ABOVE',
      'ITEM_CENTER'
    );
    await driver.navigate(currentTestLayout);
    await grabSnapshotAndCompare();
  });

  it('should have arrows on image center', async () => {
    const currentTestLayout = getLayoutStylesByVerticalPosition(
      'SHOW_ABOVE',
      'IMAGE_CENTER'
    );
    await driver.navigate(currentTestLayout);
    await grabSnapshotAndCompare();
  });
});
