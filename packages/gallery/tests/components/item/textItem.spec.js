import TextItem from '../../../src/components/item/textItem.js';
import { use, expect } from 'chai';
import spies from 'chai-spies';
import GalleryDriver from '../../drivers/reactDriver';
import { testImages } from '../../drivers/mocks/images-mock';
import sinon from 'sinon';

use(spies);

describe('Text Item', () => {
  let textItemProps;
  let galleryDriver;
  let sampleItem;
  let galleryConfig;
  beforeEach(() => {
    galleryDriver = new GalleryDriver();
    galleryConfig = galleryDriver.get.galleryConfig;
    sampleItem = testImages[0];
    textItemProps = galleryDriver.props.textView(sampleItem, galleryConfig);
  });

  it('should init', () => {
    galleryDriver.mount(TextItem, textItemProps);
    expect(galleryDriver.find.hook('text-item').length).to.equal(1);
  });

  it('should set background color', () => {
    Object.assign(textItemProps, { styleParams: { cubeType: 'fit' } });
    Object.assign(textItemProps, { style: { bgColor: 'red' } });
    galleryDriver.mount(TextItem, textItemProps);
    const style = galleryDriver.find
      .class('gallery-item-loaded.text-item')
      .get(0).props.style;
    expect(style).to.have.property('backgroundColor', 'red');
  });

  it('should resize itself', () => {
    Object.assign(textItemProps, { style: { maxWidth: 100, maxHeight: 100 } });
    galleryDriver.mount(TextItem, textItemProps);
    const style = galleryDriver.find
      .class('gallery-item-loaded.text-item')
      .get(0).props.style;
    expect(style).to.have.property('width', '100px');
    expect(style).to.have.property('height', '100px');
  });

  it('should call setItemLoaded', () => {
    const funcSpy = sinon.spy();
    Object.assign(textItemProps, { actions: { setItemLoaded: funcSpy } });
    galleryDriver.mount(TextItem, textItemProps);
    expect(funcSpy.called).to.be.true;
  });
});
