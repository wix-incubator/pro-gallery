import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

const gridFitWithPosition = (position) => {
  return {
    galleryLayout: GALLERY_CONSTS.layout.GRID,
    cubeType: GALLERY_CONSTS.cubeType.FIT,
    cubeFitPosition: position,
  };
};

describe('cubeFitPosition - e2e', () => {
  let driver;
  const { MIDDLE, TOP, BOTTOM, LEFT, RIGHT } = GALLERY_CONSTS.cubeFitPosition;
  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('should align to the middle', async () => {
    await driver.navigate(gridFitWithPosition(MIDDLE));
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should align to the left', async () => {
    await driver.navigate(gridFitWithPosition(LEFT));
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should align to the right', async () => {
    await driver.navigate(gridFitWithPosition(RIGHT));
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should align to the top', async () => {
    await driver.navigate(gridFitWithPosition(TOP));
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should align to the bottom', async () => {
    await driver.navigate(gridFitWithPosition(BOTTOM));
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
});
