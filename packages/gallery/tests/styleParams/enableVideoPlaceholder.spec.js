import GalleryDriver from '../drivers/reactDriver';
import { testVideos } from '../drivers/mocks/images-mock';
import VideoItemWrapper from '../../src/components/item/videos/videoItemWrapper';
import { expect } from 'chai';

const mountAndGetPreloadElements = (driver, sampleItemProps) => {
  driver.mount(VideoItemWrapper, sampleItemProps);
  return driver.find.selector('.gallery-item-video.image-item');
};

describe('options - enableVideoPlaceholder ', () => {
  let driver;
  let sampleItem;
  let sampleItemViewProps;

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

  it('should not remove video placeholder when "enableVideoPlaceholder=true"', async () => {
    Object.assign(sampleItemViewProps.options, {
      enableVideoPlaceholder: true,
    });
    const placeholders = mountAndGetPreloadElements(
      driver,
      sampleItemViewProps
    );
    expect(placeholders.length).to.equal(1);
  });
  it('should not remove video placeholder when "enableVideoPlaceholder=false"', async () => {
    Object.assign(sampleItemViewProps.options, {
      enableVideoPlaceholder: false,
    });
    const placeholders = mountAndGetPreloadElements(
      driver,
      sampleItemViewProps
    );
    expect(placeholders.length).to.equal(0);
  });
});
