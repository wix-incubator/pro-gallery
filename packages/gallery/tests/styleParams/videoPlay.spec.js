import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { videoItems } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - videoPlay', () => {
  let driver;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container,
      items: videoItems,
      styles: styleParams,
    };
  });

  it('should play videos automaticaly', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
      behaviourParams: {
        item: {
          video: {
            playTrigger: GALLERY_CONSTS.videoPlay.AUTO,
          },
        },
      },
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
      initialProps.styles = mergeNestedObjects(initialProps.styles, {
        behaviourParams: {
          item: {
            video: {
              playTrigger: GALLERY_CONSTS.videoPlay.HOVER,
            },
          },
        },
        galleyLayout: GALLERY_CONSTS.layout.GRID,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const galleryVideoItems = driver.find.tag('video');
      expect(galleryVideoItems).to.have.lengthOf(0);
      driver.detach.proGallery();
    });
    it('should have video element on hover', async () => {
      initialProps.styles = mergeNestedObjects(initialProps.styles, {
        behaviourParams: {
          item: {
            video: {
              playTrigger: GALLERY_CONSTS.videoPlay.HOVER,
            },
          },
        },
        galleyLayout: GALLERY_CONSTS.layout.GRID,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const itemContainer = driver.find.hook('item-container').at(0);
      itemContainer.simulate('mouseover');
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
      initialProps.styles = mergeNestedObjects(initialProps.styles, {
        behaviourParams: {
          item: {
            video: {
              playTrigger: GALLERY_CONSTS.videoPlay.CLICK,
            },
          },
        },
        galleyLayout: GALLERY_CONSTS.layout.GRID,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const galleryVideoItems = driver.find.tag('video');
      expect(galleryVideoItems).to.have.lengthOf(0);
      driver.detach.proGallery();
    });
    it('should have video element on click', async () => {
      initialProps.styles = mergeNestedObjects(initialProps.styles, {
        behaviourParams: {
          item: {
            video: {
              playTrigger: GALLERY_CONSTS.videoPlay.CLICK,
            },
          },
        },
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
