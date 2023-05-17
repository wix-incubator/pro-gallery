import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

const gridFitWithPosition = (position) => {
  return {
    [optionsMap.layoutParams.structure.galleryLayout]:
      GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
    [optionsMap.layoutParams.crop.method]: GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FIT,
    [optionsMap.layoutParams.crop.alignment]: position,
  };
};

const expectGalleryToMatchSnapshot = async (driver) => {
  await driver.waitFor.hookToBeVisible('item-container');
  const page = await driver.grab.elemScreenshot('.pro-gallery');
  expect(page).toMatchImageSnapshot();
};

describe('layoutParams_crop_alignment - e2e', () => {
  let driver;
  const { MIDDLE, TOP, BOTTOM, LEFT, RIGHT } = GALLERY_CONSTS[optionsMap.layoutParams.crop.alignment];
  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('should align to the middle', async () => {
    await driver.navigate(gridFitWithPosition(MIDDLE));
    await expectGalleryToMatchSnapshot(driver);
  });
  it('should align to the left', async () => {
    await driver.navigate(gridFitWithPosition(LEFT));
    await expectGalleryToMatchSnapshot(driver);
  });
  it('should align to the right', async () => {
    await driver.navigate(gridFitWithPosition(RIGHT));
    await expectGalleryToMatchSnapshot(driver);
  });
  it('should align to the top', async () => {
    await driver.navigate(gridFitWithPosition(TOP));
    await expectGalleryToMatchSnapshot(driver);
  });
  it('should align to the bottom', async () => {
    await driver.navigate(gridFitWithPosition(BOTTOM));
    await expectGalleryToMatchSnapshot(driver);
  });
});
