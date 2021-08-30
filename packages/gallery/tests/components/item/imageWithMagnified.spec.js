import GalleryDriver from '../../drivers/reactDriver';
import { expect } from 'chai';
import { testImages } from '../../drivers/mocks/images-mock';
import MagnifiedImage from '../../../src/components/item/imageWithMagnified';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

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
    item.simulate('mousedown', {
      clientX: 5,
      clientY: 5,
    });
    item.simulate('mouseup');
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
    item.simulate('mousedown', {
      clientX: 0,
      clientY: 0,
    });
    item.simulate('mouseup');
    item.simulate('mousedown', {
      clientX: 20,
      clientY: 20,
    });
    item.simulate('mousemove', {
      clientX: 10,
      clientY: 10,
    });
    item.simulate('mouseup');
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
