import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('enableInfiniteScroll - e2e', () => {
  // 'loadMore.enable - e2e'
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('should have "Load More" button when "enableInfiniteScroll" is "false"', async () => {
    // 'should have "Load More" button when "loadMore" is enabled'
    await driver.navigate({
      galleryLayout: 2,
      behaviourParams: {
        gallery: {
          vertical: {
            loadMore: {
              enable: true,
            },
          },
        },
      },
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should not have "Load More" button when "enableInfiniteScroll" is "true"', async () => {
    // 'should not have "Load More" button when "loadMore" is not enabled'
    await driver.navigate({
      galleryLayout: 2,
      behaviourParams: {
        gallery: {
          vertical: {
            loadMore: {
              enable: false,
            },
          },
        },
      },
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
});
