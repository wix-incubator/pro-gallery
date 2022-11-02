import GalleryDriver from '../../drivers/reactDriver';
import { expect } from 'chai';
import { testImages } from '../../drivers/mocks/images-mock';
import MagnifiedImage from '../../../src/components/item/imageWithMagnified';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

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
        [optionsMap.behaviourParams.item.clickAction]:
          GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].MAGNIFY,
        [optionsMap.behaviourParams.item.content.magnificationValue]: 2,
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
  const createAndgetMagnifiedContainer = (
    galleryDriver,
    selector = '.magnified-item-container'
  ) => {
    galleryDriver.mount(MagnifiedImage, imageItemsProps);
    return galleryDriver.find.selector(selector).at(0);
  };
  it('container should have correct initial styles', () => {
    let item = createAndgetMagnifiedContainer(driver);
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
    let item = createAndgetMagnifiedContainer(driver);
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
    let item = createAndgetMagnifiedContainer(driver);
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
    item = driver.find.selector('.magnified-images').at(0);
    console.log(item.props().style);
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
