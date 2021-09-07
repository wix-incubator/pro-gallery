import GalleryDriver from '../../drivers/reactDriver';
import { expect } from 'chai';
import { testImages } from '../../drivers/mocks/images-mock';
import MagnifiedImage from '../../../src/components/item/imageWithMagnified';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

const simulateEvent = (elem, eventName, options) => {
  if (options) {
    elem.simulate(eventName, options);
  } else {
    elem.simulate(eventName);
  }
  return elem;
};

describe('imageWithMagnified', () => {
  let driver;
  let imageItemsProps;
  let sampleItem;

  beforeEach(() => {
    driver = new GalleryDriver();
    sampleItem = testImages[0];
    imageItemsProps = driver.props.itemView(sampleItem);
    Object.assign(imageItemsProps, {
      options: {
        itemClick: GALLERY_CONSTS.itemClick.MAGNIFY,
        magnificationLevel: 2,
      },
      imageDimensions: { marginLeft: 0, marginTop: 0 },
      style: {
        cubedWidth: 250,
        cubedHeight: 250,
        innerWidth: 250,
        innerHeight: 250,
      },
    });
  });

  describe('magnificationType = ZOOM', () => {
    const createAndgetMagnifiedZoomContainer = (
      galleryDriver,
      selector = '.magnified-item-container'
    ) => {
      Object.assign(imageItemsProps.options, {
        magnificationType: GALLERY_CONSTS.magnificationType.ZOOM,
      });
      galleryDriver.mount(MagnifiedImage, imageItemsProps);
      return galleryDriver.find.selector(selector).at(0);
    };
    it('container should have correct initial styles', () => {
      let item = createAndgetMagnifiedZoomContainer(driver);
      expect(item.props().style).to.deep.equal({
        width: 250,
        height: 250,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'zoom-in',
      });
    });
    it('container should have correct magnified styles', () => {
      let item = createAndgetMagnifiedZoomContainer(driver);
      simulateEvent(item, 'mouseup');
      item = driver.find.selector('.magnified-item-container');
      expect(item.props().style).to.deep.equal({
        width: 250,
        height: 250,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'zoom-out',
      });
    });
    it('should have correct magnified style', async () => {
      let item = createAndgetMagnifiedZoomContainer(driver);
      simulateEvent(item, 'mousedown', {
        clientX: 5,
        clientY: 5,
      });
      simulateEvent(item, 'mouseup');
      item = driver.find.selector('.magnified-images').at(0);
      expect(item.props().style).to.deep.equal({
        zIndex: 2,
        position: 'absolute',
        transform: 'translate(-5px, -5px)',
        transitionDelay: '0.3s',
        opacity: 1,
        top: 0,
        left: 0,
        transition: 'opacity 0.1s ease',
      });
    });
    it('should be draggable', async () => {
      let item = createAndgetMagnifiedZoomContainer(driver);
      simulateEvent(item, 'mousedown', {
        clientX: 0,
        clientY: 0,
      });
      simulateEvent(item, 'mouseup');
      simulateEvent(item, 'mousedown', {
        clientX: 20,
        clientY: 20,
      });
      simulateEvent(item, 'mousemove', {
        clientX: 10,
        clientY: 10,
      });
      simulateEvent(item, 'mouseup');
      item = driver.find.selector('.magnified-images').at(0);
      expect(item.props().style).to.deep.equal({
        zIndex: 2,
        position: 'absolute',
        transform: 'translate(-10px, -10px)',
        transitionDelay: '0.3s',
        opacity: 1,
        top: 0,
        left: 0,
        transition: 'opacity 0.1s ease',
      });
    });
  });

  describe('magnificationType = GLASS', () => {
    const createAndgetMagnifiedGlassContainer = (
      galleryDriver,
      selector = '.magnified-item-container'
    ) => {
      Object.assign(imageItemsProps.options, {
        magnificationType: GALLERY_CONSTS.magnificationType.GLASS,
      });
      galleryDriver.mount(MagnifiedImage, imageItemsProps);
      return galleryDriver.find.selector(selector).at(0);
    };
    it('should not have "magnifying-lens" container', () => {
      createAndgetMagnifiedGlassContainer(driver);
      expect(driver.find.selector('.magnifying-lens').length).to.equal(0);
    });
    it('should have "magnifying-lens" container', () => {
      let item = createAndgetMagnifiedGlassContainer(driver);
      simulateEvent(item, 'mouseenter');
      expect(driver.find.selector('.magnifying-lens').length).to.equal(1);
    });

    it('should have correct styles and position of "magnifying-lens"', () => {
      let item = createAndgetMagnifiedGlassContainer(driver);
      simulateEvent(item, 'mouseenter');
      simulateEvent(item, 'mousemove', {
        clientX: 500,
        clientY: 500,
      });
      expect(
        driver.find.selector('.magnifying-lens').props().style
      ).to.deep.equal({
        width: 200,
        height: 200,
        backgroundColor: 'white',
        border: '2px solid white',
        position: 'absolute',
        transform: 'translate(400px, 400px)',
        overflow: 'hidden',
        borderRadius: '50%',
      });
    });
    it('should have correct styles and position of "magnifying-images"', () => {
      let item = createAndgetMagnifiedGlassContainer(driver);
      simulateEvent(item, 'mouseenter');
      simulateEvent(item, 'mousemove', {
        clientX: 500,
        clientY: 500,
      });
      expect(
        driver.find.selector('.magnified-images').props().style
      ).to.deep.equal({
        width: 500,
        height: 500,
        position: 'relative',
        transform: 'translate(-900px, -900px)',
      });
    });
  });
});
