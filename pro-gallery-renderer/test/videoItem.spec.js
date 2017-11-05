'use strict';
import {mount} from 'enzyme';
import GalleryDriver from './galleryDriver.js';
import {testVideos} from '../test/images-mock';
import React from 'react';
import VideoItem from '../src/components/item/videoItem';
import {expect} from 'chai';

describe('Video Item ', () => {

  let sampleItemViewProps, sampleItem, videoEle, videoWrapper;

  beforeEach(() => {

    const galleryDriver = new GalleryDriver();

    sampleItem = testVideos[0];
    sampleItemViewProps = galleryDriver.create.itemViewProps(sampleItem);
    Object.assign(sampleItemViewProps, {playing: false, onMount: () => {}, onUnmount: () => {}});
    videoWrapper = mount(<VideoItem
        {...sampleItemViewProps}
    />);

    videoEle = videoWrapper.instance();

  });

  it('shouldn\'t auto play', () => {
    expect(videoWrapper.props().playing).equal(false);
  });

  it('source should have right src', () => {
    expect(videoWrapper.find('ReactPlayer').props().url).equal(sampleItemViewProps.resized_url.mp4);
  });

  it('source should have right src', () => {
    expect(videoWrapper.find('ReactPlayer').props().fileConfig.attributes.poster).equal(sampleItemViewProps.resized_url.img);
  });
});
