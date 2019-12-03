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
    console.log('>>>>>>>>>>>>>>>>> test stating: should render when "allowTitle" is "true"');
    console.log('>>>>>>>>>>>>>>>>> using driver to openPage');

    await driver.openPage({
      galleryLayout: 2,
      allowTitle: true
    });
    console.log('>>>>>>>>>>>>>>>>> page should be open and we try to wait for the selector item-container');

    await driver.waitFor.hookToBeVisible('item-container');
    console.log('>>>>>>>>>>>>>>>>>should be visible and now we hover it');

    await driver.actions.hover('item-container')[0]
    await driver.waitFor.timer(200);
    console.log('>>>>>>>>>>>>>>>>> trying to make a screenshot');

    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  });
  // it('should not render when "allowTitle" is "false"', async () => {
  //   await driver.openPage({
  //     galleryLayout: 2,
  //     allowTitle: false
  //   });
  //   await driver.waitFor.hookToBeVisible('item-container');
  //   await driver.actions.hover('item-container')[0]
  //   await driver.waitFor.timer(200);
  //   const page = await driver.grab.elemScreenshot('#pro-gallery-container');
  //   expect(page).toMatchImageSnapshot();
  // });
  

})