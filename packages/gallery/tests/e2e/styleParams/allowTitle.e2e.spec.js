import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot} from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

describe('allowTitle - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchPuppeteer();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should render when "allowTitle" is "true"', async () => {
    await driver.openPage({
      galleryLayout: 2,
      allowTitle: true
    });
    await driver.actions.hover('item-container')[0]
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  },30000);
  it('should not render when "allowTitle" is "false"', async () => {
    await driver.openPage({
      galleryLayout: 2,
      allowTitle: false
    });
    await driver.actions.hover('item-container')[0]
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  },30000);

})