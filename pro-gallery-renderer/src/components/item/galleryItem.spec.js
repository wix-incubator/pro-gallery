'use strict';
import {mount} from 'enzyme';
import GalleryDriver from '../../../test/drivers/reactDriver';
import {testImages} from '../../../test/images-mock';
import {Item} from 'pro-gallery-layouter';
import React from 'react';
import GalleryItem from './galleryItem';
import {expect} from 'chai';
import sinon from 'sinon';
import utils from '../../utils/index';
import watermarkApi from 'photography-client-lib/dist/src/store/watermarkApi';



describe('GalleryItem ', () => {

  let galleryItem;
  let antiGalleryItem;
  const sampleItem = testImages[0];
  let config;
  beforeEach(() => {
    config = {createdBy: 'Yonatan', dto: sampleItem, wixImage: {
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
      wm: 'wixData.wm'}};
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
  it('uses config in parameters', () => {
    const object = {
      isGalleryItem: true,
      createdBy: 'Yonatan',
      dto:
      {metadata:
      {height: 1000,
        lastModified: 1445860855,
        name: '8b72558253b2502b401bb46e5599f22a',
        size: 1100727,
        width: 1920,
        sourceName: 'private'},
        orderIndex: 0,
        photoId: '8b72558253b2502b401bb46e5599f22a',
        url: '8bb438_1b73a6b067b24175bd087e86613bd00c.jpg',
        metaData:
        {height: 1000,
          lastModified: 1445860855,
          name: '8b72558253b2502b401bb46e5599f22a',
          size: 1100727,
          width: 1920,
          sourceName: 'private'}},
      id: '8b72558253b2502b401bb46e5599f22a',
      idx: undefined,
      _type: undefined,
      style: {width: 1920, cubedWidth: 1920, height: 1000, cubedHeight: 1000},
      width: 1920,
      maxWidth: 1920,
      height: 1000,
      maxHeight: 1000,
      margins: 0,
      ratio: 1.92,
      cubeRatio: 1.92,
      cubeImages: undefined,
      cubeType: 'fill',
      offset: {top: 0, left: 0, right: 1920, bottom: 1000},
      group: {},
      transform: {},
      orientation: 'landscape',
      visibility: {},
      sharpParams: {quality: 90, usm: {}},
      resizeWidth: 1920,
      resizeHeight: 1000,
      resized_url:
      {img: 'https://static.wixstatic.com/media/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg/v1/fill/w_1919,h_1000,fp_0.50_0.50,q_90/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg',
        thumb: 'https://static.wixstatic.com/media/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg/v1/fill/w_250,h_130,al_c,q_90,usm_0.66_1.00_0.01/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg'},
      pixel_url:
      {img: 'https://static.wixstatic.com/media/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg/v1/fill/w_250,h_250,fp_0.50_0.50,q_30,usm_0.66_1.00_0.01/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg',
        thumb: 'https://static.wixstatic.com/media/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg/v1/fill/w_250,h_130,al_c,q_30,usm_0.66_1.00_0.01/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg'},
      thumbnailWidth: 500,
      thumbnailHeight: 500,
      thumbnail_url:
      {img: 'https://static.wixstatic.com/media/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg/v1/fill/w_500,h_260,al_c,q_30,usm_0.66_1.00_0.01/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg',
        thumb: 'https://static.wixstatic.com/media/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg/v1/fill/w_250,h_130,al_c,q_30,usm_0.66_1.00_0.01/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg'},
      square_url:
      {img: 'https://static.wixstatic.com/media/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg/v1/fill/w_250,h_250,fp_0.50_0.50,q_80,usm_0.66_1.00_0.01/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg',
        thumb: 'https://static.wixstatic.com/media/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg/v1/fill/w_250,h_130,al_c,q_80,usm_0.66_1.00_0.01/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg'},
      full_url:
      {img: 'https://static.wixstatic.com/media/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg/v1/fill/w_1919,h_1000,fp_0.50_0.50,q_90/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg',
        thumb: 'https://static.wixstatic.com/media/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg/v1/fill/w_250,h_130,al_c,q_90,usm_0.66_1.00_0.01/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg'},
      sample_url:
      {img: 'https://static.wixstatic.com/media/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg/v1/fill/w_500,h_260,al_c,q_90,usm_0.66_1.00_0.01/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg',
        thumb: 'https://static.wixstatic.com/media/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg/v1/fill/w_250,h_130,al_c,q_90,usm_0.66_1.00_0.01/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg'},
      download_url:
      {img: 'https://static.wixstatic.com/media/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg?dn=',
        mp4: undefined}};
    const antiObject = {isGalleryItem: true,
      createdBy: undefined,
      dto: {},
      id: undefined,
      idx: undefined,
      _type: undefined,
      style: {width: 1, cubedWidth: 1, height: 1, cubedHeight: 1},
      width: 1,
      maxWidth: undefined,
      height: 1,
      maxHeight: undefined,
      margins: 0,
      ratio: 1,
      cubeRatio: 1,
      cubeImages: undefined,
      cubeType: 'fill',
      offset: {top: 0, left: 0, right: 1, bottom: 1},
      group: {},
      transform: {},
      orientation: 'landscape',
      visibility: {},
      sharpParams: {quality: 90, usm: {}},
      resizeWidth: NaN,
      resizeHeight: NaN,
      resized_url:
      {img: 'https://static.wixstatic.com/media/undefined/v1/fill/w_NaN,h_NaN,al_c,q_90/undefined',
        thumb: 'https://static.wixstatic.com/media/undefined/v1/fit/w_250,h_250,al_c,q_90/undefined'},
      pixel_url:
      {img: 'https://static.wixstatic.com/media/undefined/v1/fill/w_250,h_250,al_c,q_30/undefined',
        thumb: 'https://static.wixstatic.com/media/undefined/v1/fit/w_250,h_250,al_c,q_30/undefined'},
      thumbnailWidth: NaN,
      thumbnailHeight: NaN,
      thumbnail_url:
      {img: 'https://static.wixstatic.com/media/undefined/v1/fit/w_NaN,h_NaN,al_c,q_30/undefined',
        thumb: 'https://static.wixstatic.com/media/undefined/v1/fit/w_250,h_250,al_c,q_30/undefined'},
      square_url:
      {img: 'https://static.wixstatic.com/media/undefined/v1/fill/w_250,h_250,al_c,q_80/undefined',
        thumb: 'https://static.wixstatic.com/media/undefined/v1/fit/w_250,h_250,al_c,q_80/undefined'},
      full_url:
      {img: 'https://static.wixstatic.com/media/undefined/v1/fill/w_NaN,h_NaN,al_c,q_90/undefined',
        thumb: 'https://static.wixstatic.com/media/undefined/v1/fit/w_250,h_250,al_c,q_90/undefined'},
      sample_url:
      {img: 'https://static.wixstatic.com/media/undefined/v1/fit/w_500,h_500,al_c,q_90/undefined',
        thumb: 'https://static.wixstatic.com/media/undefined/v1/fit/w_250,h_250,al_c,q_90/undefined'},
      download_url:
      {img: 'https://static.wixstatic.com/media/undefined?dn=',
        mp4: undefined}};
    delete galleryItem.uniqueId;
    delete antiGalleryItem.uniqueId;
    expect(galleryItem).to.deep.equal(object);
    expect(antiGalleryItem).to.deep.equal(antiObject);
  });
	//not testing missuse of item-core

  it('should use processScheme on scheme created from dto, does not have scheme parameters undefined without dto', () => {
    expect(galleryItem.id).equal('8b72558253b2502b401bb46e5599f22a');
    expect(antiGalleryItem.id).equal(undefined);
  });
  it('cubeType is fill if scheme.cropType is undefined', () => {
    Object.assign(config, {scheme: {cropType: 'aaa'}});
    galleryItem = new GalleryItem(config);
    expect(galleryItem.cubeType).equal('aaa');
    expect(antiGalleryItem.cubeType).equal('fill');
  });
  it('createFromWixImage', () => {
    Object.assign(config, {orderIndex: 1});
    galleryItem = new GalleryItem(config);
    const object = {isGalleryItem: true,
      createdBy: 'Yonatan',
      dto:
      {itemId: 'aaaa',
        mediaUrl: 'aaaaaaaa',
        orderIndex: 1,
        metadata:
        {height: 300,
          width: 300,
          focalPoint: 3,
          name: 'wixData.title',
          fileName: '',
          title: '',
          type: 'wixData.type',
          link:
          {type: 'none',
            url: undefined,
            text: undefined,
            title: undefined,
            target: '_blank'},
          sourceName: 'wixData.sourceName',
          tags: 'wixData.tags',
          wm: 'wixData.wm'},
        isSecure: undefined,
        metaData:
        {height: 300,
          width: 300,
          focalPoint: 3,
          name: 'wixData.title',
          fileName: '',
          title: '',
          type: 'wixData.type',
          link:
          {type: 'none',
            url: undefined,
            text: undefined,
            title: undefined,
            target: '_blank'},
          sourceName: 'wixData.sourceName',
          tags: 'wixData.tags',
          wm: 'wixData.wm'}},
      id: '8b72558253b2502b401bb46e5599f22a',
      idx: undefined,
      _type: undefined,
      style: {width: 1920, cubedWidth: 1920, height: 1000, cubedHeight: 1000},
      width: 1920,
      maxWidth: 1920,
      height: 1000,
      maxHeight: 1000,
      margins: 0,
      ratio: 1.92,
      cubeRatio: 1.92,
      cubeImages: undefined,
      cubeType: 'fill',
      offset: {top: 0, left: 0, right: 1920, bottom: 1000},
      group: {},
      transform: {},
      orientation: 'landscape',
      visibility: {},
      sharpParams: {quality: 90, usm: {}},
      resizeWidth: 1920,
      resizeHeight: 1000,
      resized_url:
      {img: 'https://static.wixstatic.com/media/aaaaaaaa',
        thumb: 'https://static.wixstatic.com/media/aaaaaaaa'},
      pixel_url:
      {img: 'https://static.wixstatic.com/media/aaaaaaaa',
        thumb: 'https://static.wixstatic.com/media/aaaaaaaa'},
      thumbnailWidth: 500,
      thumbnailHeight: 500,
      thumbnail_url:
      {img: 'https://static.wixstatic.com/media/aaaaaaaa',
        thumb: 'https://static.wixstatic.com/media/aaaaaaaa'},
      square_url:
      {img: 'https://static.wixstatic.com/media/aaaaaaaa',
        thumb: 'https://static.wixstatic.com/media/aaaaaaaa'},
      full_url:
      {img: 'https://static.wixstatic.com/media/aaaaaaaa',
        thumb: 'https://static.wixstatic.com/media/aaaaaaaa'},
      sample_url:
      {img: 'https://static.wixstatic.com/media/aaaaaaaa',
        thumb: 'https://static.wixstatic.com/media/aaaaaaaa'},
      download_url:
      {img: 'https://static.wixstatic.com/media/aaaaaaaa?dn=',
        mp4: undefined}};
    delete galleryItem.uniqueId;
    delete galleryItem.metadata.createdOn;
    delete galleryItem.metadata.lastModified;
    expect(galleryItem).to.deep.equal(object);
  });
  it('createFromWixVideo', () => {
    delete config.wixImage;
    Object.assign(config, {orderIndex: 1, wixVideo: {
      fileOutput: {image: {aa: {url: 'media/aaa', width: 100, height: 100}}, video: [{height: 100, width: 100, quality: 'high', format: 'mp4'}, {height: 200, width: 200, quality: 'high', format: 'best'}]},
      fileInput: {duration: 100},
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
      wm: 'wixData.wm'
    }});
    galleryItem = new GalleryItem(config);
    const url = galleryItem.resizedUrl('fill', 100, 100, {quality: 80}, false);
    const object = {isGalleryItem: true,
      createdBy: 'Yonatan',
      dto:
      {itemId: undefined,
        mediaUrl: 'asdasd',
        orderIndex: 1,
        metaData:
        {name: '',
          width: 100,
          height: 100,
          type: 'video',
          posters: [{url: 'aaa', width: 100, height: 100}],
          customPoster: '',
          isExternal: false,
          duration: 100,
          qualities:
          [{height: 100, width: 100, quality: 'high', formats: ['mp4']},
							{height: 200, width: 200, quality: 'high', formats: ['best']}],
          link:
          {type: 'none',
            url: undefined,
            text: undefined,
            title: undefined,
            target: '_blank'}},
        isSecure: undefined},
      id: '8b72558253b2502b401bb46e5599f22a',
      idx: undefined,
      _type: undefined,
      style: {width: 1920, cubedWidth: 1920, height: 1000, cubedHeight: 1000},
      width: 1920,
      maxWidth: 1920,
      height: 1000,
      maxHeight: 1000,
      margins: 0,
      ratio: 1.92,
      cubeRatio: 1.92,
      cubeImages: undefined,
      cubeType: 'fill',
      offset: {top: 0, left: 0, right: 1920, bottom: 1000},
      group: {},
      transform: {},
      orientation: 'landscape',
      visibility: {},
      sharpParams: {quality: 90, usm: {}},
      resizeWidth: 1920,
      resizeHeight: 1000,
      resized_url:
      {mp4: 'about://video.wixstatic.com/video/asdasd/high/mp4/file.mp4',
        img: 'https://static.wixstatic.com/media/aaa',
        thumb: 'https://static.wixstatic.com/media/aaa'},
      pixel_url:
      {mp4: 'about://video.wixstatic.com/video/asdasd/high/mp4/file.mp4',
        img: 'https://static.wixstatic.com/media/aaa',
        thumb: 'https://static.wixstatic.com/media/aaa'},
      thumbnailWidth: 500,
      thumbnailHeight: 500,
      thumbnail_url:
      {mp4: 'about://video.wixstatic.com/video/asdasd/high/mp4/file.mp4',
        img: 'https://static.wixstatic.com/media/aaa',
        thumb: 'https://static.wixstatic.com/media/aaa'},
      square_url:
      {mp4: 'about://video.wixstatic.com/video/asdasd/high/mp4/file.mp4',
        img: 'https://static.wixstatic.com/media/aaa',
        thumb: 'https://static.wixstatic.com/media/aaa'},
      full_url:
      {mp4: 'about://video.wixstatic.com/video/asdasd/high/mp4/file.mp4',
        img: 'https://static.wixstatic.com/media/aaa',
        thumb: 'https://static.wixstatic.com/media/aaa'},
      sample_url:
      {mp4: 'about://video.wixstatic.com/video/asdasd/high/mp4/file.mp4',
        img: 'https://static.wixstatic.com/media/aaa',
        thumb: 'https://static.wixstatic.com/media/aaa'},
      download_url:
      {img: 'https://static.wixstatic.com/media/asdasd?dn=',
        mp4: 'about://video.wixstatic.com/video/asdasd/high/mp4/file.mp4'}};
    delete galleryItem.uniqueId;
    delete galleryItem.metadata.createdOn;
    delete galleryItem.metadata.lastModified;
    expect(galleryItem).to.deep.equal(object);
  });
  it('createFromExternal', () => {
    delete config.wixImage;
    Object.assign(config, {orderIndex: 1, wixExternal: {
      fileOutput: {image: {aa: {url: 'media/aaa', width: 100, height: 100}}, video: [{height: 100, width: 100, quality: 'high', format: 'mp4'}, {height: 200, width: 200, quality: 'high', format: 'best'}]},
      fileInput: {duration: 100},
      fileBaseUrl: 'video/asdasd',
      posters: [{url: 'media/aaa', width: 100, height: 100}],
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
      wm: 'wixData.wm'
    }});
    galleryItem = new GalleryItem(config);
    const url = galleryItem.resizedUrl('fill', 100, 100, {quality: 80}, false);
    const object = {isGalleryItem: true,
      createdBy: 'Yonatan',
      dto:
      {itemId: undefined,
        mediaUrl: 'media/aaa',
        orderIndex: 1,
        metaData:
        {name: undefined,
          videoId: undefined,
          height: 1080,
          width: 1920,
          source: '',
          videoUrl: '',
          isExternal: true,
          type: 'video',
          posters: [{url: 'media/aaa', width: 100, height: 100}],
          customPoster: '',
          duration: 0,
          qualities: []},
        isSecure: undefined},
      id: '8b72558253b2502b401bb46e5599f22a',
      idx: undefined,
      _type: undefined,
      style: {width: 1920, cubedWidth: 1920, height: 1000, cubedHeight: 1000},
      width: 1920,
      maxWidth: 1920,
      height: 1000,
      maxHeight: 1000,
      margins: 0,
      ratio: 1.92,
      cubeRatio: 1.92,
      cubeImages: undefined,
      cubeType: 'fill',
      offset: {top: 0, left: 0, right: 1920, bottom: 1000},
      group: {},
      transform: {},
      orientation: 'landscape',
      visibility: {},
      sharpParams: {quality: 90, usm: {}},
      resizeWidth: 1920,
      resizeHeight: 1000,
      resized_url:
      {img: 'https://static.wixstatic.com/media/aaa',
        thumb: 'https://static.wixstatic.com/media/aaa'},
      pixel_url:
      {img: 'https://static.wixstatic.com/media/aaa',
        thumb: 'https://static.wixstatic.com/media/aaa'},
      thumbnailWidth: 500,
      thumbnailHeight: 500,
      thumbnail_url:
      {img: 'https://static.wixstatic.com/media/aaa',
        thumb: 'https://static.wixstatic.com/media/aaa'},
      square_url:
      {img: 'https://static.wixstatic.com/media/aaa',
        thumb: 'https://static.wixstatic.com/media/aaa'},
      full_url:
      {img: 'https://static.wixstatic.com/media/aaa',
        thumb: 'https://static.wixstatic.com/media/aaa'},
      sample_url:
      {img: 'https://static.wixstatic.com/media/aaa',
        thumb: 'https://static.wixstatic.com/media/aaa'},
      download_url:
      {img: 'https://static.wixstatic.com/media/media/aaa?dn=',
        mp4: undefined}};
    delete galleryItem.uniqueId;
    delete galleryItem.metadata.createdOn;
    delete galleryItem.metadata.lastModified;
    expect(galleryItem).to.deep.equal(object);
  });
  it('defaultLink Text', () => {
    galleryItem.linkType = 'wix';
    galleryItem.linkData = undefined;
    expect(galleryItem.defaultLinkText).to.equal('Go to Link');
    galleryItem.linkType = 'wix';
    galleryItem.linkData = {type: 'PageLink', pageName: 'yo', phoneNumber: '5557525', anchorName: 'foo', url: 'abcd', recipient: 'bar', name: 'yonatan'};
    expect(galleryItem.defaultLinkText).to.equal('Go to Page yo');
    galleryItem.linkData = {type: 'AnchorLink', pageName: 'yo', phoneNumber: '5557525', anchorName: 'foo', url: 'abcd', recipient: 'bar', name: 'yonatan'};
    expect(galleryItem.defaultLinkText).to.equal('Scroll to foo');
    galleryItem.linkData = {type: 'ExternalLink', pageName: 'yo', phoneNumber: '5557525', anchorName: 'foo', url: 'abcd', recipient: 'bar', name: 'yonatan'};
    expect(galleryItem.defaultLinkText).to.equal('abcd');
    galleryItem.linkData = {type: 'EmailLink', pageName: 'yo', phoneNumber: '5557525', anchorName: 'foo', url: 'abcd', recipient: 'bar', name: 'yonatan'};
    expect(galleryItem.defaultLinkText).to.equal('Email bar');
    galleryItem.linkData = {type: 'PhoneLink', pageName: 'yo', phoneNumber: '5557525', anchorName: 'foo', url: 'abcd', recipient: 'bar', name: 'yonatan'};
    expect(galleryItem.defaultLinkText).to.equal('Call 5557525');
    galleryItem.linkData = {type: 'DocumentLink', pageName: 'yo', phoneNumber: '5557525', anchorName: 'foo', url: 'abcd', recipient: 'bar', name: 'yonatan'};
    expect(galleryItem.defaultLinkText).to.equal('Open yonatan');
    galleryItem.linkData = {type: 'foobar', pageName: 'yo', phoneNumber: '5557525', anchorName: 'foo', url: 'abcd', recipient: 'bar', name: 'yonatan'};
    expect(galleryItem.defaultLinkText).to.equal('Go to Link');
  });
  it('getting correct resized url', () => {
		//2 tests of the output.
    let url = galleryItem.resizedUrl('fill', 100, 100, {quality: 80}, false);
    let object = {img: 'https://static.wixstatic.com/media/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg/v1/fill/w_250,h_250,fp_0.50_0.50,q_80,usm_0.66_1.00_0.01/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg',
      thumb: 'https://static.wixstatic.com/media/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg/v1/fill/w_250,h_130,al_c,q_80,usm_0.66_1.00_0.01/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg'};
    expect(url).to.deep.equal(object);
    url = galleryItem.resizedUrl('fit', 100, 300, {quality: 85}, true);
    object = {img: 'https://static.wixstatic.com/media/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg/v1/fill/w_250,h_130,al_c,q_85,usm_0.66_1.00_0.01/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg',
      thumb: 'https://static.wixstatic.com/media/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg/v1/fill/w_250,h_130,al_c,q_85,usm_0.66_1.00_0.01/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg'};
    expect(url).to.deep.equal(object);
  });
  it('should send error if watermark is a string that cant be parsed to an object', () => {
    const stub = sinon.stub(utils, 'isStoreGallery').returns(true);
    const spyerror = sinon.spy(console, 'error');
    Object.assign(config, {watermark: 'ssss', type: 'image'});
    galleryItem = new GalleryItem(config);
    expect(spyerror.called).to.equal(true);
    expect(galleryItem.watermarkStrSdk).to.equal(undefined);
    stub.restore();
    spyerror.restore();
  });
  it('should parse into a water mark object if watermark is a string that can be parsed', () => {
    const stub = sinon.stub(utils, 'isStoreGallery').returns(true);
    const spyerror = sinon.spy(console, 'error');
    Object.assign(config, {watermark: '{"imageUrl": "aaa", "opacity": 0.5, "position": 1, "size": 300}', type: 'image'});
    galleryItem = new GalleryItem(config);
    expect(spyerror.called).to.equal(false);
    expect(galleryItem.watermarkStr).to.equal(',wm_aaa-0.5-1-300');
    expect(galleryItem.watermarkStrSdk).to.equal('aaa-0.5-1-300');
    stub.restore();
    spyerror.restore();
  });
  it('should work with a watermark object', () => {
    const stub = sinon.stub(utils, 'isStoreGallery').returns(true);
    const spyerror = sinon.spy(console, 'error');
    Object.assign(config, {watermark: {imageUrl: 'aaa', opacity: 0.5, position: 1, size: 300}, type: 'image'});
    galleryItem = new GalleryItem(config);
    expect(spyerror.called).to.equal(false);
    expect(galleryItem.watermarkStr).to.equal(',wm_aaa-0.5-1-300');
    expect(galleryItem.watermarkStrSdk).to.equal('aaa-0.5-1-300');
    stub.restore();
    spyerror.restore();
  });
  it('should get a new watermark if there is none in the config', done => {
		//IMOPRTANT -
		// notice that the watermarkData is a promise. thus it resolves into .then and assignes the strings only after the data returns.
		// to stub such a function into returning something(an object in this example), it is not enought to use "returns" but we need to use "resolves" because we will then have a .then function attached.
		// now that we have .then, we can not simply "expect" strings to be assigned immediately. the will be undefined.
		// to counter this i put the creation of the class in a promise of it's own. and in the resolving .then I use the "expects".
    const stub = sinon.stub(utils, 'isStoreGallery').returns(true);
    const stubApi = sinon.stub(watermarkApi, 'getWatermarkData').resolves({imageUrl: 'aaa', opacity: 0.5, position: 1, size: 300});
    const spyerror = sinon.spy(console, 'error');
    Object.assign(config, {type: 'image'});
    console.log(watermarkApi.getWatermarkData());
    console.log(galleryItem.watermarkStr);
    const resolvingItem = new Promise(resolve => {
      galleryItem = new GalleryItem(config);
      resolve();
    });
    resolvingItem.then(() => {
      expect(spyerror.called).to.equal(false);
      expect(galleryItem.watermarkStr).to.equal(',wm_aaa-0.5-1-300');
      expect(galleryItem.watermarkStrSdk).to.equal('aaa-0.5-1-300');
      done();
    });
    stub.restore();
    spyerror.restore();
    stubApi.restore();
  });
  it('should get a new watermark if there is none in the config, if imageUrl is missing. return empty strings', done => {
    const stub = sinon.stub(utils, 'isStoreGallery').returns(true);
    const stubApi = sinon.stub(watermarkApi, 'getWatermarkData').resolves({opacity: 0.5, position: 1, size: 300});
    const spyerror = sinon.spy(console, 'error');
    Object.assign(config, {type: 'image'});
    console.log(watermarkApi.getWatermarkData());
    console.log(galleryItem.watermarkStr);
    const resolvingItem = new Promise(resolve => {
      galleryItem = new GalleryItem(config);
      resolve();
    });
    resolvingItem.then(() => {
      expect(spyerror.called).to.equal(false);
      expect(galleryItem.watermarkStr).to.equal('');
      expect(galleryItem.watermarkStrSdk).to.equal('');
      done();
    });
    stub.restore();
    spyerror.restore();
  });
  it('shoud return correct linkOpenType', () => {
    const stubEditor = sinon.stub(utils, 'isEditor').returns(true);
    const stubPreview = sinon.stub(utils, 'isPreview').returns(true);
    expect(galleryItem.linkOpenType).to.equal('_blank');
    stubEditor.returns(false);
    expect(galleryItem.linkOpenType).to.equal('_blank');
    stubPreview.returns(false);
    expect(galleryItem.linkOpenType).to.equal('_blank'); // that blank is not the same as before, its the last return
    galleryItem.metadata.link = {
      targetBlank: true
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
    expect(galleryItem.getDataForShop()).to.deep.equal({isDemo: undefined,
      orderIndex: 0,
      itemId: undefined,
      originalUrl: 'https://static.wixstatic.com/media/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg',
      itemUrl: '8bb438_1b73a6b067b24175bd087e86613bd00c.jpg',
      itemHeight: 1000,
      title: undefined,
      itemWidth: 1920,
      itemType: 'image',
      imageUrl: 'https://static.wixstatic.com/media/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg/v1/fill/w_250,h_130,al_c,q_80,usm_0.66_1.00_0.01/8bb438_1b73a6b067b24175bd087e86613bd00c.jpg',
      imagePurchasedUrl: undefined,
      fpX: 0.5,
      fpY: 0.5});
  });
});
