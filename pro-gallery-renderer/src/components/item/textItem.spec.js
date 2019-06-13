import TextItem from './textItem.js';
import { shallow, mount } from 'enzyme';
import React from 'react';
import utils from '../../utils';
import { use, spy, expect } from 'chai';
import spies from 'chai-spies';
import ItemView from './itemView.js';
import GalleryDriver from '../../../__testsDrivers__/drivers/reactDriver.js';
import { testImages } from '../../../__testsDrivers__/images-mock';
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

  it('shoud render html given in props when visible is true', () => {
    Object.assign(textItemProps, { visible: true });
    Object.assign(textItemProps, { html: 'test' });
    galleryDriver.mount(TextItem, textItemProps);
    expect(galleryDriver.text).to.equal('test');

    Object.assign(textItemProps, { visible: false });
    Object.assign(textItemProps, { styleParams: { hasThumbnails: false } });
    Object.assign(textItemProps, { html: 'test' });
    galleryDriver.mount(TextItem, textItemProps);
    expect(galleryDriver.text).to.equal('');
  });

  it('shoud render html given in props when hasThumbnails is true', () => {
    Object.assign(textItemProps, { visible: false });
    Object.assign(textItemProps, { styleParams: { hasThumbnails: true } });
    Object.assign(textItemProps, { html: 'test' });
    galleryDriver.mount(TextItem, textItemProps);
    expect(galleryDriver.text).to.equal('test');
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
