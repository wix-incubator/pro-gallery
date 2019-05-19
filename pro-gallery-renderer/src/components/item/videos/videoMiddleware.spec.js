import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import utils from '../../../utils';
import { VideoQueue } from './video-queue';
import videoMiddleware from './videoMiddleware';

describe('Video Item ', () => {
  const store = {
    getState() {
      return {
        gallery: {
          videoPlayMode: 1,
        },
      };
    },
    dispatch: action => {},
  };
  const next = action => {};
  let videoQueue;
  let middleware;
  let videoData1;
  let videoData2;
  let action;
  let isEditorStub;
  let isPreviewStub;

  beforeEach(() => {
    videoQueue = new VideoQueue();
    middleware = videoMiddleware({ videoQueue, utils })(store)(next);
    videoData1 = {
      idx: 1,
      isVisible: () => true,
    };
    videoData2 = {
      idx: 2,
      isVisible: () => true,
    };
    isEditorStub = sinon.stub(utils, 'isEditor').returns(false);
    isPreviewStub = sinon.stub(utils, 'isPreview').returns(false);
  });

  afterEach(() => {
    isEditorStub.restore();
    isPreviewStub.restore();
  });

  it('video added and video removed effecting the queue', () => {
    action = {
      type: 'VIDEO_ADDED',
      payload: videoData1,
    };
    middleware(action);
    expect(videoQueue.current()).to.equal(1);
    action = {
      type: 'VIDEO_REMOVED',
      payload: 1,
    };
    middleware(action);
    expect(videoQueue.current()).to.equal(-1);
  });

  it('not editor && if autoplay & video ended, should play next visible video', () => {
    action = {
      type: 'VIDEO_ADDED',
      payload: videoData1,
    };
    middleware(action);
    videoData2 = {
      idx: 2,
      isVisible: () => false,
    };
    action = {
      type: 'VIDEO_ADDED',
      payload: videoData2,
    };
    middleware(action);
    const videoData3 = {
      idx: 3,
      isVisible: () => true,
    };
    action = {
      type: 'VIDEO_ADDED',
      payload: videoData3,
    };
    middleware(action);
    expect(videoQueue.current()).to.equal(1);
    action = {
      type: 'VIDEO_ENDED',
    };
    middleware(action);
    expect(videoQueue.current()).to.equal(3);
  });

  it('not editor && if autoplay & navigation in, should play next visible video', () => {
    action = {
      type: 'VIDEO_ADDED',
      payload: videoData1,
    };
    middleware(action);
    videoData2 = {
      idx: 2,
      isVisible: () => false,
    };
    action = {
      type: 'VIDEO_ADDED',
      payload: videoData2,
    };
    middleware(action);
    const videoData3 = {
      idx: 3,
      isVisible: () => true,
    };
    action = {
      type: 'VIDEO_ADDED',
      payload: videoData3,
    };
    middleware(action);
    expect(videoQueue.current()).to.equal(1);
    action = {
      type: 'NAVIGATION_IN',
    };
    middleware(action);
    expect(videoQueue.current()).to.equal(3);
  });

  it('not editor && if autoplay & editor mode changed, should still play current if visible', () => {
    action = {
      type: 'VIDEO_ADDED',
      payload: videoData1,
    };
    middleware(action);
    action = {
      type: 'VIDEO_ADDED',
      payload: videoData2,
    };
    middleware(action);
    action = {
      type: 'EDITOR_MODE_CHANGED',
    };
    middleware(action);
    expect(videoQueue.current()).to.equal(1);
  });

  it('not editor && if autoplay & gallery window layout changed, should still play current if visible', () => {
    action = {
      type: 'VIDEO_ADDED',
      payload: videoData1,
    };
    middleware(action);
    action = {
      type: 'VIDEO_ADDED',
      payload: videoData2,
    };
    middleware(action);
    action = {
      type: 'GALLERY_WINDOW_LAYOUT_CHANGED',
    };
    middleware(action);
    expect(videoQueue.current()).to.equal(1);
  });

  it('not editor && if autoplay & editor mode changed, should play next visible if current is not visible', () => {
    videoData1 = {
      idx: 1,
      isVisible: () => false,
    };
    action = {
      type: 'VIDEO_ADDED',
      payload: videoData1,
    };
    middleware(action);
    action = {
      type: 'VIDEO_ADDED',
      payload: videoData2,
    };
    middleware(action);
    expect(videoQueue.current()).to.equal(1);
    action = {
      type: 'EDITOR_MODE_CHANGED',
    };
    middleware(action);
    expect(videoQueue.current()).to.equal(2);
  });

  it('not editor && if autoplay & gallery window layout changed, should play next visible if current is not visible', () => {
    videoData1 = {
      idx: 1,
      isVisible: () => false,
    };
    action = {
      type: 'VIDEO_ADDED',
      payload: videoData1,
    };
    middleware(action);
    action = {
      type: 'VIDEO_ADDED',
      payload: videoData2,
    };
    middleware(action);
    expect(videoQueue.current()).to.equal(1);
    action = {
      type: 'GALLERY_WINDOW_LAYOUT_CHANGED',
    };
    middleware(action);
    expect(videoQueue.current()).to.equal(2);
  });
});
