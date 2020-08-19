import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('leanGallery - e2e', () => {
  let driver;

  const fixedLeanGalleryStyleParams = {
    allowLeanGallery: true,
    galleryLayout: GALLERY_CONSTS.layout.GRID,
    targetItemSize: 370,
    isVertical: true,
    cubeImages: true,
    cubeRatio: 1,
    groupSize: 1,
    titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
    imageInfoType: GALLERY_CONSTS.infoType.DONT_SHOW,
    scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
  };

  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });

  it('should successfully render leanGallery', async () => {
    await driver.openPage({
      ...fixedLeanGalleryStyleParams,
    });
    await driver.waitFor.hookToBeVisible('lean-gallery');
    await driver.waitFor.timer(200);
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  });


  // it('should NOT render leanGallery (beacause scrollDirection: HORIZONTAL)', async () => {
  //   await driver.openPage({
  //     ...fixedLeanGalleryStyleParams,
  //     scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL
  //   });
  //   await driver.waitFor.hookToBeVisible('item-container'); // 'item-container' is data-hook that exists in proGallery (and not in leanGallery)
  //   await driver.waitFor.timer(200);
  //   const page = await driver.grab.screenshot();
  //   expect(page).toMatchImageSnapshot();
  // });

  // it('should NOT render leanGallery (beacause titlePlacement: SHOW_ON_THE_RIGHT)', async () => {
  //   await driver.openPage({
  //     ...fixedLeanGalleryStyleParams,
  //     titlePlacement: GALLERY_CONSTS.placements.SHOW_ON_THE_RIGHT
  //   });
  //   await driver.waitFor.hookToBeVisible('item-container'); // 'item-container' is data-hook that exists in proGallery (and not in leanGallery)
  //   await driver.waitFor.timer(200);
  //   const page = await driver.grab.screenshot();
  //   expect(page).toMatchImageSnapshot();
  // });

  // it('should NOT render leanGallery (beacause imageHoverAnimation: ZOOM_IN)', async () => {
  //   await driver.openPage({
  //     ...fixedLeanGalleryStyleParams,
  //     imageHoverAnimation: GALLERY_CONSTS.imageHoverAnimations.ZOOM_IN
  //   });
  //   await driver.waitFor.hookToBeVisible('item-container'); // 'item-container' is data-hook that exists in proGallery (and not in leanGallery)
  //   await driver.waitFor.timer(200);
  //   const page = await driver.grab.screenshot();
  //   expect(page).toMatchImageSnapshot();
  // });
})
