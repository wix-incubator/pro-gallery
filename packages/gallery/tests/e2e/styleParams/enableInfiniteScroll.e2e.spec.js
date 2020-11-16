import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('enableInfiniteScroll - e2e', () => {
  let driver;
  
  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll( async() => {
    await driver.closePage();
  });
  it('should have "Load More" button when "enableInfiniteScroll" is "false"', async () => {
    await driver.navigate({
      galleryLayout: 2,
      enableInfiniteScroll: false
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should not have "Load More" button when "enableInfiniteScroll" is "true"', async () => {
    await driver.navigate({
      galleryLayout: 2,
      enableInfiniteScroll: true
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
})