import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { videoItems } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - videoPlay', () => {

  //let driver;
  const initialProps = {
    container,
    items: videoItems,
    styles: styleParams
  }
  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should play videos automaticaly', async () => {
    Object.assign(initialProps.styles, {
      videoPlay: GALLERY_CONSTS.videoPlay.AUTO,
      galleyLayout: GALLERY_CONSTS.layout.GRID,
    })
    driver.mount.proGallery(initialProps);
    await driver.update(100);
    const galleryVideoItems = driver.find.hook('video_container-video-player-element');
    expect(galleryVideoItems.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  })

  describe('VideoPlay - HOVER', () => {
    beforeEach(() => {
      driver = new GalleryDriver();
    });

    it('should not have video elements intially (with no hover event)', async () => {
      Object.assign(initialProps.styles, {
        videoPlay: GALLERY_CONSTS.videoPlay.HOVER,
        galleyLayout: GALLERY_CONSTS.layout.GRID,
      })
      driver.mount.proGallery(initialProps);
      await driver.update(100);
      const galleryVideoItems = driver.find.hook('video_container-video-player-element');
      expect(galleryVideoItems).to.have.lengthOf(0)
      driver.detach.proGallery();
    });
    it('should have video element on hover', async () => {
      Object.assign(initialProps.styles, {
        videoPlay: GALLERY_CONSTS.videoPlay.HOVER,
        galleyLayout: GALLERY_CONSTS.layout.GRID,
      })
      driver.mount.proGallery(initialProps);
      await driver.update(100);
      const itemContainer = driver.find.hook('item-container').at(0);
      itemContainer.simulate('mouseover');
      const videoItem = driver.find.hook('video_container-video-player-element');
      expect(videoItem).to.have.lengthOf(1)
      driver.detach.proGallery();
    });
  })

  describe('VideoPlay - ONCLICK', () => {
    beforeEach(() => {
      driver = new GalleryDriver();
    });

    it('should not have video elements intially (with no click event)', async () => {
      Object.assign(initialProps.styles, {
        videoPlay: GALLERY_CONSTS.videoPlay.ON_CLICK,
        galleyLayout: GALLERY_CONSTS.layout.GRID,
      })
      driver.mount.proGallery(initialProps);
      await driver.update(100);
      const galleryVideoItems = driver.find.hook('video_container-video-player-element');
      expect(galleryVideoItems).to.have.lengthOf(0)
      driver.detach.proGallery();
    });
    it('should have video element on click', async () => {
      Object.assign(initialProps.styles, {
        videoPlay: GALLERY_CONSTS.videoPlay.ON_CLICK,
        galleyLayout: GALLERY_CONSTS.layout.GRID,
        itemClick: GALLERY_CONSTS.itemClick.NOTHING,
      })
      driver.mount.proGallery(initialProps);
      await driver.update(100);
      const itemContainer = driver.find.hook('item-wrapper').at(0);
      itemContainer.simulate('click');
      const videoItem = driver.find.hook('video_container-video-player-element');
      expect(videoItem).to.have.lengthOf(1)
      driver.detach.proGallery();
    });
  })
})
