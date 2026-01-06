import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { videoItems } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - videoPlay', () => {
  let driver;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container,
      items: videoItems,
      options,
    };
  });

  it('should play videos automaticaly', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      videoPlay: GALLERY_CONSTS.videoPlay.AUTO,
      galleyLayout: GALLERY_CONSTS.layout.GRID,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryVideoItems = driver.find.hook(
      'video_container-video-player-element'
    );
    expect(galleryVideoItems.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });

  describe('VideoPlay - HOVER', () => {
    beforeEach(() => {
      driver = new GalleryDriver();
    });

    it('should not have video elements intially (with no hover event)', async () => {
      initialProps.options = mergeNestedObjects(initialProps.options, {
        videoPlay: GALLERY_CONSTS.videoPlay.HOVER,
        galleyLayout: GALLERY_CONSTS.layout.GRID,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const galleryVideoItems = driver.find.tag('video');
      expect(galleryVideoItems).to.have.lengthOf(0);
      driver.detach.proGallery();
    });
    it('should have video element on hover', async () => {
      initialProps.options = mergeNestedObjects(initialProps.options, {
        videoPlay: GALLERY_CONSTS.videoPlay.HOVER,
        galleyLayout: GALLERY_CONSTS.layout.GRID,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const itemContainer = driver.find.hook('item-container').at(0);
      itemContainer.simulate('mouseEnter');
      const videoItem = driver.find.tag('video');
      expect(videoItem).to.have.lengthOf(2);
      driver.detach.proGallery();
    });
  });

  describe('VideoPlay - ONCLICK', () => {
    beforeEach(() => {
      driver = new GalleryDriver();
    });

    it('should not have video elements intially (with no click event)', async () => {
      initialProps.options = mergeNestedObjects(initialProps.options, {
        videoPlay: GALLERY_CONSTS.videoPlay.ON_CLICK,
        galleyLayout: GALLERY_CONSTS.layout.GRID,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const galleryVideoItems = driver.find.tag('video');
      expect(galleryVideoItems).to.have.lengthOf(0);
      driver.detach.proGallery();
    });
    it('should have video element on click', async () => {
      initialProps.options = mergeNestedObjects(initialProps.options, {
        videoPlay: GALLERY_CONSTS.videoPlay.ON_CLICK,
        galleyLayout: GALLERY_CONSTS.layout.GRID,
        itemClick: GALLERY_CONSTS.itemClick.NOTHING,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const itemContainer = driver.find.hook('item-wrapper').at(0);
      itemContainer.simulate('click');
      const videoItem = driver.find.tag('video');
      expect(videoItem).to.have.lengthOf(2);
      driver.detach.proGallery();
    });
  });
});
