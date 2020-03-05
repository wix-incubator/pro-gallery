import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import GALLERY_CONSTS from '../../../src/common/constants';

jest.setTimeout(30000)

expect.extend({ toMatchImageSnapshot });

describe('allowSocial - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should render when "allowSocial" is "true"', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE,
      allowSocial: true
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot({failureThreshold: 0.0002, failureThresholdType: 'percent'});
  });
  it('should not render when "allowSocial" is "false"', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE,
      allowSocial: false
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot({failureThreshold: 0.0002, failureThresholdType: 'percent'});
  });
})