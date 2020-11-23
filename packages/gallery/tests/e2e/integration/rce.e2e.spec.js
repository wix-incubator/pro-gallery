// import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('RCE Integration test', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll( async() => {
    await driver.closePage();
  });
  it('should match screenshot with default RCE styles', async () => {
    await driver.navigate({
        galleryLayout: 2,
        gallerySizeType: 'px',
        gallerySizePx: 300,
        galleryMargin: 0,
        oneRow: false,
        cubeRatio: 1,
        galleryThumbnailsAlignment: 'bottom',
        isVertical: false,
        imageMargin: 20,
        thumbnailSpacings: 0,
        cubeType: 'fill',
        enableInfiniteScroll: true,
        titlePlacement: 'SHOW_ON_HOVER',
        allowHover: false,
        itemClick: 'link',
        fullscreen: false,
        showArrows: false,
        gridStyle: 1,
        loveButton: false,
        allowSocial: false,
        allowDownload: false,
        mobileSwipeAnimation: 'NO_EFFECT',
        thumbnailSize: 120,
        gotStyleParams: true,
        showVideoPlayButton: true,
        videoPlay: 'onClick',
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(400);
    const page = await driver.grab.partialScreenshot();
    expect(page).toMatchImageSnapshot();
  });
  it('should match screenshot with mibile and title styles for RCE', async () => {
    const styleParams = {
      galleryLayout: 2,
      gallerySizeType: 'px',
      gallerySizePx: 300,
      galleryMargin: 0,
      oneRow: false,
      cubeRatio: 1,
      galleryThumbnailsAlignment: 'bottom',
      isVertical: false,
      imageMargin: 20,
      thumbnailSpacings: 0,
      cubeType: 'fill',
      enableInfiniteScroll: true,
      titlePlacement: 'SHOW_ON_HOVER',
      allowHover: false,
      itemClick: 'link',
      fullscreen: false,
      showArrows: false,
      gridStyle: 1,
      loveButton: false,
      allowSocial: false,
      allowDownload: false,
      mobileSwipeAnimation: 'NO_EFFECT',
      thumbnailSize: 120,
      gotStyleParams: true,
      showVideoPlayButton: true,
      videoPlay: 'onClick',
  };
    await driver.navigate({
      ...styleParams,
      allowHover: true, //for mobile
      isVertical: styleParams.galleryLayout === 1, // allow titles...
      allowTitle: true,
      galleryTextAlign: 'center',
      textsHorizontalPadding: 0,
      imageInfoType: 'NO_BACKGROUND',
      hoveringBehaviour: 'APPEARS',
      textsVerticalPadding: 0,
      titlePlacement: 'SHOW_BELOW',
      calculateTextBoxHeightMode: 'AUTOMATIC',
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(400);
    const page = await driver.grab.partialScreenshot();
    expect(page).toMatchImageSnapshot();
  });
})
