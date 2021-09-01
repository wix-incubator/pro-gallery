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
      options: { itemClick: GALLERY_CONSTS.itemClick.MAGNIFY },
      imageDimensions: { borderRadius: null },
      style: {
        magnifiedHeight: 500,
        magnifiedWidth: 500,
        cubedWidth: 250,
        cubedHeight: 250,
      },
    });
  });
  const createAndgetMagnifiedContainer = (
    galleryDriver,
    selector = '.magnified-item-container'
  ) => {
    galleryDriver.mount(MagnifiedImage, imageItemsProps);
    return galleryDriver.find.selector(selector).at(0);
  };
  it('should have correct magnified style', async () => {
    let item = createAndgetMagnifiedContainer(driver);
    simulateEvent(item, 'mousedown', {
      clientX: 5,
      clientY: 5,
    });
    simulateEvent(item, 'mouseup');
    item = driver.find.selector('.magnified-item-container').at(0);
    expect(item.props().style).to.deep.equal({
      width: 500,
      height: 500,
      cursor: 'zoom-out',
      position: 'relative',
      transition: 'transform .3s ease',
      transform: 'translate(-5px, -5px)',
    });
  });
  it('should be draggable', async () => {
    let item = createAndgetMagnifiedContainer(driver);
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
    item = driver.find.selector('.magnified-item-container').at(0);
    expect(item.props().style).to.deep.equal({
      width: 500,
      height: 500,
      cursor: 'zoom-out',
      position: 'relative',
      transform: 'translate(-10px, -10px)',
      transition: 'none',
    });
  });
});
