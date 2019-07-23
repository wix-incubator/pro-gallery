import { mount } from 'enzyme';
import GalleryDriver from '../../../__testsDrivers__/drivers/reactDriver';
import { testImages } from '../../../__testsDrivers__/images-mock';
import { Item } from 'pro-gallery-layouter';
import React from 'react';
import GalleryItem from './galleryItem';
import { expect } from 'chai';
import sinon from 'sinon';
import utils from '../../utils/index';

describe('GalleryItem ', () => {
  let galleryItem;
  let antiGalleryItem;
  const sampleItem = testImages[0];
  let config;
  beforeEach(() => {
    config = {
      createdBy: 'Yonatan',
      dto: sampleItem,
      wixImage: {
        scheme: { cropType: 'aaa', dto: { directLink: {} } },
        url: 'aaaaaaaa',
        height: 300,
        width: 300,
        focalPoint: 3,
        name: 'aaa',
        fileName: 'wixData.title',
        title: '',
        type: 'wixData.type',
        link: 'this.initialLinkObject',
        sourceName: 'wixData.sourceName',
        tags: 'wixData.tags',
        wm: 'wixData.wm',
      },
    };
    galleryItem = new GalleryItem(config);
    antiGalleryItem = new GalleryItem({});
  });
  it('should have a unique ID', () => {
    expect(galleryItem.uniqueId).to.not.equal(antiGalleryItem.uniqueId);
  });
  it('should have a createdBy when defined', () => {
    expect(galleryItem.createdBy).to.equal('Yonatan');
    expect(antiGalleryItem.createdBy).to.equal(undefined);
  });
  it('isGalleryItem should be true', () => {
    expect(galleryItem.isGalleryItem).to.equal(true);
  });
  it('recieves correct styles from dto', () => {
    expect(galleryItem.style).to.deep.equal({
      width: 1920,
      cubedWidth: 1920,
      height: 1000,
      cubedHeight: 1000,
    });
    expect(antiGalleryItem.style).to.deep.equal({
      width: 1,
      cubedWidth: 1,
      height: 1,
      cubedHeight: 1,
    });
  });
  //not testing missuse of item-core

  it('should use processScheme on scheme created from dto, does not have scheme parameters (undefined) without dto', () => {
    expect(galleryItem.id).equal('8b72558253b2502b401bb46e5599f22a');
    expect(antiGalleryItem.id).equal(undefined);
  });
  it('cubeType is fill if scheme.cropType is undefined', () => {
    Object.assign(config, {
      scheme: { cropType: 'aaa', dto: { directLink: {} } },
    });
    galleryItem = new GalleryItem(config);
    expect(galleryItem.cubeType).equal('aaa');
    expect(antiGalleryItem.cubeType).equal('fill');
  });
  it('createFromWixImage', () => {
    Object.assign(config, { orderIndex: 1 });
    galleryItem = new GalleryItem(config);
    expect(galleryItem.metaData.width).to.deep.equal(300); //metaData is taken from metadata after the crateFromWixImage
    expect(galleryItem.metaData.height).to.deep.equal(300);
  });
  it('createFromWixVideo', () => {
    delete config.wixImage;
    Object.assign(config, {
      orderIndex: 1,
      wixVideo: {
        fileOutput: {
          image: { aa: { url: 'media/aaa', width: 100, height: 100 } },
          video: [
            { height: 100, width: 100, quality: 'high', format: 'mp4' },
            { height: 200, width: 200, quality: 'high', format: 'best' },
          ],
        },
        fileInput: { duration: 100 },
        fileBaseUrl: 'video/asdasd',
        url: 'aaaaaaaa',
        height: 300,
        width: 300,
        focalPoint: 3,
        name: 'aaa',
        fileName: 'wixData.title',
        title: '',
        type: 'wixData.type',
        link: 'this.initialLinkObject',
        sourceName: 'wixData.sourceName',
        tags: 'wixData.tags',
        wm: 'wixData.wm',
      },
    });
    galleryItem = new GalleryItem(config);
    expect(galleryItem.metaData.height).to.deep.equal(100);
    expect(galleryItem.metaData.width).to.deep.equal(100);
  });
  it('createFromExternal', () => {
    delete config.wixImage;
    Object.assign(config, {
      orderIndex: 1,
      wixExternal: {
        fileOutput: {
          image: { aa: { url: 'media/aaa', width: 100, height: 100 } },
          video: [
            { height: 100, width: 100, quality: 'high', format: 'mp4' },
            { height: 200, width: 200, quality: 'high', format: 'best' },
          ],
        },
        fileInput: { duration: 100 },
        fileBaseUrl: 'video/asdasd',
        posters: [{ url: 'media/aaa', width: 100, height: 100 }],
        url: 'aaaaaaaa',
        height: 300,
        width: 300,
        focalPoint: 3,
        name: 'aaa',
        fileName: 'wixData.title',
        title: '',
        type: 'wixData.type',
        link: 'this.initialLinkObject',
        sourceName: 'wixData.sourceName',
        tags: 'wixData.tags',
        wm: 'wixData.wm',
      },
    });
    galleryItem = new GalleryItem(config);
    expect(galleryItem.metaData.height).to.deep.equal(1080); //these width/height numbers are hard coded for externals so it doesnt take it from anywhere else.
    expect(galleryItem.metaData.width).to.deep.equal(1920);
  });
  it('defaultLink Text', () => {
    galleryItem.linkType = 'wix';
    galleryItem.linkData = undefined;
    expect(galleryItem.defaultLinkText).to.equal('Go to Link');
    galleryItem.linkType = 'wix';
    galleryItem.linkData = {
      type: 'PageLink',
      pageName: 'yo',
      phoneNumber: '5557525',
      anchorName: 'foo',
      url: 'abcd',
      recipient: 'bar',
      name: 'yonatan',
    };
    expect(galleryItem.defaultLinkText).to.equal('Go to Page yo');
    galleryItem.linkData = {
      type: 'AnchorLink',
      pageName: 'yo',
      phoneNumber: '5557525',
      anchorName: 'foo',
      url: 'abcd',
      recipient: 'bar',
      name: 'yonatan',
    };
    expect(galleryItem.defaultLinkText).to.equal('Scroll to foo');
    galleryItem.linkData = {
      type: 'ExternalLink',
      pageName: 'yo',
      phoneNumber: '5557525',
      anchorName: 'foo',
      url: 'abcd',
      recipient: 'bar',
      name: 'yonatan',
    };
    expect(galleryItem.defaultLinkText).to.equal('abcd');
    galleryItem.linkData = {
      type: 'EmailLink',
      pageName: 'yo',
      phoneNumber: '5557525',
      anchorName: 'foo',
      url: 'abcd',
      recipient: 'bar',
      name: 'yonatan',
    };
    expect(galleryItem.defaultLinkText).to.equal('Email bar');
    galleryItem.linkData = {
      type: 'PhoneLink',
      pageName: 'yo',
      phoneNumber: '5557525',
      anchorName: 'foo',
      url: 'abcd',
      recipient: 'bar',
      name: 'yonatan',
    };
    expect(galleryItem.defaultLinkText).to.equal('Call 5557525');
    galleryItem.linkData = {
      type: 'DocumentLink',
      pageName: 'yo',
      phoneNumber: '5557525',
      anchorName: 'foo',
      url: 'abcd',
      recipient: 'bar',
      name: 'yonatan',
    };
    expect(galleryItem.defaultLinkText).to.equal('Open yonatan');
    galleryItem.linkData = {
      type: 'foobar',
      pageName: 'yo',
      phoneNumber: '5557525',
      anchorName: 'foo',
      url: 'abcd',
      recipient: 'bar',
      name: 'yonatan',
    };
    expect(galleryItem.defaultLinkText).to.equal('Go to Link');
  });
  // it('getting correct resized url', () => {
  //   //2 tests of the output.
  //   const url = galleryItem.resizedUrl(
  //     'fill',
  //     100,
  //     100,
  //     { quality: 80 },
  //     false,
  //   );
  //   const object = {
  //     img:
  //       'https://static.wixstatic.com/media/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg/v1/fill/w_100,h_100,fp_0.50_0.50,q_80/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg',
  //     thumb:
  //       'https://static.wixstatic.com/media/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg/v1/fill/w_250,h_250,fp_0.50_0.50,q_70,blur_30/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg',
  //     seoLink:
  //       'https://static.wixstatic.com/media/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg/v1/fill/w_100,h_100,fp_0.50_0.50,q_80/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg',
  //   };
  //   expect(url).to.deep.equal(object);
  // });
  // it('should send error if watermark is a string that cant be parsed to an object', () => {
  //   const stub = sinon.stub(utils, 'isStoreGallery').returns(true);
  //   const spyerror = sinon.stub(console, 'error');
  //   Object.assign(config, { watermark: 'ssss', type: 'image' });
  //   galleryItem = new GalleryItem(config);
  //   expect(spyerror.called).to.equal(true);
  //   expect(galleryItem.watermarkStrSdk).to.equal(undefined);
  //   stub.restore();
  //   spyerror.restore();
  // });
  // it('should parse into a water mark object if watermark is a string that can be parsed', () => {
  //   const stub = sinon.stub(utils, 'isStoreGallery').returns(true);
  //   const spyerror = sinon.stub(console, 'error');
  //   Object.assign(config, {
  //     watermark:
  //       '{"imageUrl": "aaa", "opacity": 0.5, "position": 1, "size": 300}',
  //     type: 'image',
  //   });
  //   galleryItem = new GalleryItem(config);
  //   expect(spyerror.called).to.equal(false);
  //   expect(galleryItem.watermarkStr).to.equal(',wm_aaa-0.5-1-300');
  //   expect(galleryItem.watermarkStrSdk).to.equal('aaa-0.5-1-300');
  //   stub.restore();
  //   spyerror.restore();
  // });
  // it('should work with a watermark object', () => {
  //   const stub = sinon.stub(utils, 'isStoreGallery').returns(true);
  //   const spyerror = sinon.spy(console, 'error');
  //   Object.assign(config, {
  //     watermark: { imageUrl: 'aaa', opacity: 0.5, position: 1, size: 300 },
  //     type: 'image',
  //   });
  //   galleryItem = new GalleryItem(config);
  //   expect(spyerror.called).to.equal(false);
  //   expect(galleryItem.watermarkStr).to.equal(',wm_aaa-0.5-1-300');
  //   expect(galleryItem.watermarkStrSdk).to.equal('aaa-0.5-1-300');
  //   stub.restore();
  //   spyerror.restore();
  // });
  // it('should get a new watermark if there is none in the config', done => {
  //   //IMOPRTANT -
  //   // notice that the watermarkData is a promise. thus it resolves into .then and assignes the strings only after the data returns.
  //   // to stub such a function into returning something(an object in this example), it is not enought to use "returns" but we need to use "resolves" because we will then have a .then function attached.
  //   // now that we have .then, we can not simply "expect" strings to be assigned immediately. the will be undefined.
  //   // to counter this i put the creation of the class in a promise of it's own. and in the resolving .then I use the "expects".
  //   const stub = sinon.stub(utils, 'isStoreGallery').returns(true);
  //   const stubApi = sinon
  //     .stub(watermarkApi, 'getWatermarkData')
  //     .resolves({ imageUrl: 'aaa', opacity: 0.5, position: 1, size: 300 });
  //   const spyerror = sinon.spy(console, 'error');
  //   Object.assign(config, { type: 'image' });
  //   const resolvingItem = new Promise(resolve => {
  //     galleryItem = new GalleryItem(config);
  //     resolve();
  //   });
  //   resolvingItem.then(() => {
  //     expect(spyerror.called).to.equal(false);
  //     expect(galleryItem.watermarkStr).to.equal(',wm_aaa-0.5-1-300');
  //     expect(galleryItem.watermarkStrSdk).to.equal('aaa-0.5-1-300');
  //     done();
  //   });
  //   stub.restore();
  //   spyerror.restore();
  //   stubApi.restore();
  // });
  // it('should get a new watermark if there is none in the config, if imageUrl is missing. return empty strings', done => {
  //   const stub = sinon.stub(utils, 'isStoreGallery').returns(true);
  //   const stubApi = sinon
  //     .stub(watermarkApi, 'getWatermarkData')
  //     .resolves({ opacity: 0.5, position: 1, size: 300 });
  //   const spyerror = sinon.spy(console, 'error');
  //   Object.assign(config, { type: 'image' });
  //   const resolvingItem = new Promise(resolve => {
  //     galleryItem = new GalleryItem(config);
  //     resolve();
  //   });
  //   resolvingItem.then(() => {
  //     expect(spyerror.called).to.equal(false);
  //     expect(galleryItem.watermarkStr).to.equal('');
  //     expect(galleryItem.watermarkStrSdk).to.equal('');
  //     done();
  //   });
  //   stub.restore();
  //   spyerror.restore();
  // });
  it('shoud return correct linkOpenType', () => {
    const stubEditor = sinon.stub(utils, 'isEditor').returns(true);
    const stubPreview = sinon.stub(utils, 'isPreview').returns(true);
    expect(galleryItem.linkOpenType).to.equal('_blank');
    stubEditor.returns(false);
    expect(galleryItem.linkOpenType).to.equal('_blank');
    stubPreview.returns(false);
    expect(galleryItem.linkOpenType).to.equal('_blank'); // that blank is not the same as before, its the last return
    galleryItem.metadata.link = {
      targetBlank: true,
    };
    expect(galleryItem.linkOpenType).to.equal('_blank');
    galleryItem.link.targetBlank = false;
    expect(galleryItem.linkOpenType).to.equal('_top');
    galleryItem.linkOpenType = 'target';
    expect(galleryItem.linkOpenType).to.equal('target');
    stubEditor.restore();
    stubPreview.restore();
  });
  it('getDataForShop snapshot', () => {
    expect(galleryItem.getDataForShop().itemHeight).to.equal(1000);
    expect(galleryItem.getDataForShop().itemWidth).to.equal(1920);
  });
});
