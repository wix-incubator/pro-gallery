import ImageItem from './imageItem.js';
import { expect } from 'chai';
import GalleryDriver from '../../../__testsDrivers__/drivers/reactDriver.js';
import { testImages } from '../../../__testsDrivers__/images-mock';

describe('Image Item', () => {
  let galleryDriver, sampleItem, imageItemsProps;

  beforeEach(() => {
    galleryDriver = new GalleryDriver();
    sampleItem = testImages[0];
    imageItemsProps = galleryDriver.props.itemView(sampleItem);
  });

  it('should init', () => {
    galleryDriver.mount(ImageItem, imageItemsProps);
    expect(galleryDriver.find.hook('image-item').length).to.equal(1);
  });

  it('should set grid-fit if cubeType is fit', () => {
    Object.assign(imageItemsProps, {
      styleParams: { cubeType: 'fit', cubeImages: true },
    });
    galleryDriver.mount(ImageItem, imageItemsProps);
    expect(galleryDriver.find.hook('image-item').hasClass('grid-fit')).to.be
      .true;
  });

  //These tests are not working with the new gallery container (using css scroll)
  // it('should set backgroundImage if not loaded or if device has memory issues', () => {
  //   Object.assign(imageItemsProps, {loaded: false, resized_url: {thumb: 'test'}});
  //   let stub = sinon.stub(utils, 'deviceHasMemoryIssues').returns(false);
  //   galleryDriver.mount(ImageItem, imageItemsProps);
  //   let style = galleryDriver.find.hook('image-item').get(0).props.style;
  //   expect(style).to.have.property('backgroundImage', 'url(test)');
  //   stub.restore();

  //   Object.assign(imageItemsProps, {loaded: false, resized_url: {thumb: 'test'}});
  //   stub = sinon.stub(utils, 'deviceHasMemoryIssues').returns(true);
  //   galleryDriver.mount(ImageItem, imageItemsProps);
  //   style = galleryDriver.find.hook('image-item').get(0).props.style;
  //   expect(style.backgroundImage).to.equal(undefined);
  //   stub.restore();
  // });

  // it('should call setItemError on error event if visible is true', () => {
  //   Object.assign(imageItemsProps, {visible: true});
  //   const spy = sinon.spy();
  //   Object.assign(imageItemsProps, {actions: {setItemError: spy}});
  //   galleryDriver.mount(ImageItem, imageItemsProps);
  //   const errEvent = new Event('err');
  //   galleryDriver.find.selector('img').simulate('error', errEvent);
  //   expect(spy.called).to.be.true;
  // });

  // it('put alternate text for the image if isThumbnail is false', () => {
  //   Object.assign(imageItemsProps, {alt: 'test'});
  //   Object.assign(imageItemsProps, {isThumbnail: false});
  //   galleryDriver.mount(ImageItem, imageItemsProps);
  //   expect(galleryDriver.find.selector('img').get(0).props.alt).to.equal('test');
  // });
});
