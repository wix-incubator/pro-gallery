import GalleryDriver from '../drivers/pupDriver';
import {use, spy, expect, chai} from 'chai';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';

describe('Gallery', () => {

  let driver;

  beforeEach(() => {
    driver = new GalleryDriver();
    //driver.debug = true;
  });

  afterEach(async () => {
    driver.closeGallery();
  });

  it('renders default items', async () => {
    await driver.openGallery('Default');
    expect((await driver.find.hook('item-container')).length).to.equal(11);
    expect((await driver.find.hook('gallery-item-social-button')).length).to.equal(11);
    expect((await driver.find.hook('item-download')).length).to.equal(0);
  });
  it('renders empty with no items', async () => {
    await driver.openGallery('Empty Gallery');
    expect((await driver.find.hook('item-container')).length).to.equal(0);
  });
  it('does not have a social button when allowSocial is false', async () => {
    await driver.openGallery('Masonry');
    await driver.actions.hover('item-container');
    await driver.waitFor.hookToExist('item-container');
    expect((await driver.find.hook('gallery-item-social-button')).length).to.equal(0);
  });
  it('items have download buttons when loveButton is true', async () => {
    await driver.openGallery('Masonry');
    await driver.actions.hover('item-container');
    await driver.waitFor.hookToExist('item-container');
    expect((await driver.find.hook('item-download')).length).to.equal(11);
  });
  it('items do not have love button', async () => {
    await driver.openGallery('Masonry');
    await driver.actions.hover('item-container');
    await driver.waitFor.hookToExist('item-container');
    expect((await driver.find.hook('item-download')).length).to.equal(11);
  });
  it('adds and removes counter to clikcs on love button', async () => {
    await driver.openGallery('Grid');
    await driver.actions.hover('item-container');
    expect((await driver.find.hook('love-counter')).length).to.equal(0);
    await driver.actions.click('love-icon');
    expect((await driver.find.hook('love-counter')).length).to.equal(1);
    await driver.actions.click('love-icon');
    expect((await driver.find.hook('love-counter')).length).to.equal(0);
  });
	//this does not work, looks like the storybook has separate frames for the tumbnails and the photos themselves

  it('renders default items', async () => {
    await driver.openGallery('Thumbnails');
    expect((await driver.find.hook('gallery-thumbnails')).length).to.equal(1);
    expect((await driver.find.hook('item-container')).length).to.equal(16); //only 5 thumbnails rendered in this window size
  });

	//IMPORTANT - the next test will check that when we click a sharing button it actually opens a new page.
	//Because of the way async functions work it is possible that by the time we click the button and jump to expecting the number
	// Of pages to be +1 the actual page did not have enough real time to open and thus - the test will fail.
	// In any test wher ethings "move" we might have to wait enough time to check them or create events that will know when it is time to check
	// and not only when to check but also when to give up (so not to get up to the full super long 30 secs default timeout).
  it('should open new page on a click on a social network', async () => {
    await driver.openGallery('Default');
		// hover on first item
    await driver.actions.hover('item-container');
		// click on share button - dh: gallery-item-social-button
    await driver.actions.click('gallery-item-social-button');
		// grab the current number of pages
    const numOfPages = await driver.grab.numOfPages();
		//check that its 2 (the default after opening the storybook gallery)
    expect(numOfPages).to.equal(2);
		// create a promise that will resolve when a new page actually opens. (setting wait time of 2000ms - if the page did not open by then it rejects)
    const newPagePromise = driver.waitFor.newPage(1000); // 1000ms should be enought of the new page to open. less than 300+- will fail, we also dont want it to be flaky
		//click the facebook share
    await driver.actions.click('facebook-share-button');
		//the propmise is returned (to fail the test if it doesnt work)
    return newPagePromise.then(async () => {
			//here we put the expected vaules that we want to check (true, its like we double checked that the page was opened. once by resolving the promise and once by the change from 2 to 3 pages)
      expect(await driver.grab.numOfPages()).to.equal(3);
    });
  });
	//IMPORTANT following test uses the evaluate(&company) functions of puppeteer.
	//This means that the commands issued in those functions will run in the browser's console.
	//Wallaby.js will not be able to test this because it tries to inject global parameters for its own greedy purposes.
	//Running this in the terminal is just fine.
  it('shows share buttons (opacity 0 to 1) on an item', async () => {
    await driver.openGallery('Default');
    await driver.actions.hover('item-container');
    expect(await driver.grab.style('social-share-box', 'opacity')).to.equal('0');
    await driver.actions.click('gallery-item-social-button');
    await driver.waitFor.timer(100); // IMPORTANT - if we dont wait just a bit here the test will fail because the opacity does not have time to change.
    expect(await driver.grab.style('social-share-box', 'opacity')).to.not.equal('0');
  }, 16000);
});

