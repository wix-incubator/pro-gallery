import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

// gets relevant layout style params
const getLayoutStylesByVerticalPosition = (
  titlePlacement,
  layoutParams_navigationArrows_verticalAlignment
) => {
  return {
    [optionsMap.layoutParams.structure.galleryLayout]:
      GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].SLIDER,
    [optionsMap.layoutParams.info.placement]: titlePlacement,
    [optionsMap.layoutParams.navigationArrows.size]: 60,
    [optionsMap.layoutParams.navigationArrows.verticalAlignment]:
      layoutParams_navigationArrows_verticalAlignment,
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

describe('layoutParams_navigationArrows_position with info below - e2e', () => {
  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });

  it('should have arrows on info center', async () => {
    const currentTestLayout = getLayoutStylesByVerticalPosition(
      GALLERY_CONSTS[optionsMap.layoutParams.info.placement].BELOW,
      GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.verticalAlignment]
        .INFO_CENTER
    );
    await driver.navigate(currentTestLayout);
    await grabSnapshotAndCompare();
  });

  it('should have arrows on item center', async () => {
    const currentTestLayout = getLayoutStylesByVerticalPosition(
      GALLERY_CONSTS[optionsMap.layoutParams.info.placement].BELOW,
      GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.verticalAlignment]
        .ITEM_CENTER
    );
    await driver.navigate(currentTestLayout);
    await grabSnapshotAndCompare();
  });

  it('should have arrows on image center', async () => {
    const currentTestLayout = getLayoutStylesByVerticalPosition(
      GALLERY_CONSTS[optionsMap.layoutParams.info.placement].BELOW,
      GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.verticalAlignment]
        .IMAGE_CENTER
    );
    await driver.navigate(currentTestLayout);
    await grabSnapshotAndCompare();
  });
});

describe('layoutParams_navigationArrows_position with info above - e2e', () => {
  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });

  it('should have arrows on info center', async () => {
    const currentTestLayout = getLayoutStylesByVerticalPosition(
      GALLERY_CONSTS[optionsMap.layoutParams.info.placement].ABOVE,
      GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.verticalAlignment]
        .INFO_CENTER
    );
    await driver.navigate(currentTestLayout);
    await grabSnapshotAndCompare();
  });

  it('should have arrows on item center', async () => {
    const currentTestLayout = getLayoutStylesByVerticalPosition(
      GALLERY_CONSTS[optionsMap.layoutParams.info.placement].ABOVE,
      GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.verticalAlignment]
        .ITEM_CENTER
    );
    await driver.navigate(currentTestLayout);
    await grabSnapshotAndCompare();
  });

  it('should have arrows on image center', async () => {
    const currentTestLayout = getLayoutStylesByVerticalPosition(
      GALLERY_CONSTS[optionsMap.layoutParams.info.placement].ABOVE,
      GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.verticalAlignment]
        .IMAGE_CENTER
    );
    await driver.navigate(currentTestLayout);
    await grabSnapshotAndCompare();
  });
});
