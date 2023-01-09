import { utils } from 'pro-gallery-lib';
import GalleryDriver from '../../../drivers/reactDriver';
import { testVideos } from '../../../drivers/mocks/images-mock';
import sinon from 'sinon';
import VideoItem from '../../../../src/components/item/videos/videoItem';
// import VideoItemWrapper from '../../../../src/components/item/videos/videoItemWrapper';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

describe('Video Item ', () => {
  let driver;
  let sampleItem;
  let sampleItemViewProps;
  let stub;

  beforeEach(() => {
    driver = new GalleryDriver();
    sampleItem = testVideos[0];
    sampleItemViewProps = driver.props.itemView(sampleItem);
    Object.assign(sampleItemViewProps, {
      playing: false,
      onMount: () => {},
      onUnmount: () => {},
      loadingStatus: {},
      imageDimensions: {},
    });
  });

  it('should create PlayerElement if video can play in gallery, and is set to play', async () => {
    stub = sinon.stub(utils, 'isMobile').returns(true);
    Object.assign(sampleItemViewProps.options, {
      [optionsMap.behaviourParams.item.clickAction]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].LINK,
    });
    driver.mount(VideoItem, sampleItemViewProps);
    driver.set.props({ playing: true });
    expect(
      driver.find.hook('video_container-video-player-element').length
    ).to.equal(1);
    expect(driver.find.tag('video').length).to.equal(0);
    expect(driver.find.hook('video_container-image-element').length).to.equal(
      0
    );

    Object.assign(sampleItemViewProps.options, {
      [optionsMap.behaviourParams.item.clickAction]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].NOTHING,
    });
    driver.mount(VideoItem, sampleItemViewProps);
    driver.set.props({ playing: true });
    expect(
      driver.find.hook('video_container-video-player-element').length
    ).to.equal(1);
    expect(driver.find.tag('video').length).to.equal(0);
    expect(driver.find.hook('video_container-image-element').length).to.equal(
      0
    );
    stub.restore();

    stub = sinon.stub(utils, 'isMobile').returns(false);
    Object.assign(sampleItemViewProps.options, {
      [optionsMap.behaviourParams.item.clickAction]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].LINK,
    });
    driver.mount(VideoItem, sampleItemViewProps);
    driver.set.props({ playing: true });
    expect(
      driver.find.hook('video_container-video-player-element').length
    ).to.equal(1);
    expect(driver.find.tag('video').length).to.equal(0);
    expect(driver.find.hook('video_container-image-element').length).to.equal(
      0
    );
    Object.assign(sampleItemViewProps.options, {
      [optionsMap.behaviourParams.item.clickAction]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].NOTHING,
    });
    driver.mount(VideoItem, sampleItemViewProps);
    driver.set.props({ playing: true });
    expect(
      driver.find.hook('video_container-video-player-element').length
    ).to.equal(1);
    expect(driver.find.tag('video').length).to.equal(0);
    expect(driver.find.hook('video_container-image-element').length).to.equal(
      0
    );
    stub.restore();

    stub = sinon.stub(utils, 'isMobile').returns(false);
    Object.assign(sampleItemViewProps.options, {
      [optionsMap.behaviourParams.item.video.playTrigger]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].HOVER,
    });
    driver.mount(VideoItem, sampleItemViewProps);
    driver.set.props({ playing: true });
    expect(
      driver.find.hook('video_container-video-player-element').length
    ).to.equal(1);
    expect(driver.find.tag('video').length).to.equal(0);
    expect(driver.find.hook('video_container-image-element').length).to.equal(
      0
    );
    Object.assign(sampleItemViewProps.options, {
      [optionsMap.behaviourParams.item.video.playTrigger]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].AUTO,
    });
    driver.mount(VideoItem, sampleItemViewProps);
    driver.set.props({ playing: true });
    expect(
      driver.find.hook('video_container-video-player-element').length
    ).to.equal(1);
    expect(driver.find.tag('video').length).to.equal(0);
    expect(driver.find.hook('video_container-image-element').length).to.equal(
      0
    );
    stub.restore();
  });

  // it('source should have right src', async () => {
  //   Object.assign(sampleItemViewProps, {
  //     videoUrl: '',
  //     [optionsMap.behaviourParams.item.video.loop]: true,
  //   });
  //   driver.mount(VideoItem, sampleItemViewProps);
  //   expect(driver.find.selector('ReactPlayer').props().url).equal(
  //     sampleItemViewProps.createUrl(
  //       GALLERY_CONSTS.urlSizes.RESIZED,
  //       GALLERY_CONSTS.urlTypes.VIDEO
  //     )
  //   );
  //   expect(
  //     driver.find.selector('ReactPlayer').props().config.file.attributes.poster
  //   ).equal(
  //     sampleItemViewProps.createUrl(
  //       GALLERY_CONSTS.urlSizes.RESIZED,
  //       GALLERY_CONSTS.urlTypes.HIGH_RES
  //     )
  //   );
  //   Object.assign(sampleItemViewProps, {
  //     videoUrl: 'https://www.youtube.com/watch?v=2J5GzHoKl1Q',
  //   });
  //   driver.mount(VideoItem, sampleItemViewProps);
  //   expect(driver.find.selector('ReactPlayer').props().url).equal(
  //     'https://www.youtube.com/watch?v=2J5GzHoKl1Q'
  //   );
  //   expect(
  //     driver.find.selector('ReactPlayer').props().config.file.attributes.poster
  //   ).equal(
  //     sampleItemViewProps.createUrl(
  //       GALLERY_CONSTS.urlSizes.RESIZED,
  //       GALLERY_CONSTS.urlTypes.HIGH_RES
  //     )
  //   );
  // });

  // it('video controls should be hidden if hidePlay', async () => {
  //   Object.assign(sampleItemViewProps, {
  //     hidePlay: true,
  //   });
  //   driver.mount(VideoItemWrapper, sampleItemViewProps);
  //   expect(driver.find.hook('play-triangle').length).to.equal(0);
  //   expect(driver.find.hook('play-background').length).to.equal(0);
  //   Object.assign(sampleItemViewProps, {
  //     hidePlay: true,
  //   });
  //   Object.assign(sampleItemViewProps.options, {
  //     showVideoPlayButton: true,
  //   });
  //   driver.mount(VideoItemWrapper, sampleItemViewProps);
  //   expect(driver.find.hook('play-triangle').length).to.equal(0);
  //   expect(driver.find.hook('play-background').length).to.equal(0);
  // });

  // it('video controls should appear if not hidePlay and showVideoPlayButton', async () => {
  //   Object.assign(sampleItemViewProps, {
  //     hidePlay: false,
  //   });
  //   Object.assign(sampleItemViewProps.options, {
  //     showVideoPlayButton: true,
  //   });
  //   driver.mount(VideoItemWrapper, sampleItemViewProps);
  //   expect(driver.find.hook('play-triangle').length).to.equal(1);
  //   expect(driver.find.hook('play-background').length).to.equal(1);
  //   Object.assign(sampleItemViewProps, {
  //     hidePlay: false,
  //   });
  //   Object.assign(sampleItemViewProps.options, {
  //     showVideoPlayButton: false,
  //   });
  //   driver.mount(VideoItemWrapper, sampleItemViewProps);
  //   expect(driver.find.hook('play-triangle').length).to.equal(0);
  //   expect(driver.find.hook('play-background').length).to.equal(0);
  // });
});
