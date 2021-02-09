import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('ssr - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('alternate layout - scrollDirection = vertical', async () => {
    await driver.navigate({ disableSSROpacity: true });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(10000);
    const page = await driver.grab.partialScreenshot();
    expect(page).toMatchImageSnapshot();
  });
});
