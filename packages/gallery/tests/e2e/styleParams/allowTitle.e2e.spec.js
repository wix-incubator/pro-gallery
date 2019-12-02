import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot} from 'jest-image-snapshot';

jest.setTimeout(30000)

expect.extend({ toMatchImageSnapshot });

describe('allowTitle - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should render when "allowTitle" is "true"', async () => {
    await driver.openPage({
      galleryLayout: 2,
      allowTitle: true
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.actions.hover('item-container')[0]
    await driver.waitFor.timer(2000);
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  });
  it('should not render when "allowTitle" is "false"', async () => {
    await driver.openPage({
      galleryLayout: 2,
      allowTitle: false
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.actions.hover('item-container')[0]
    await driver.waitFor.timer(2000);
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  });

})