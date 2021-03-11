import GalleryDriver from '../drivers/reactDriver';
import { videoItems } from '../drivers/mocks/items';
import VideoItem from '../../src/components/item/videos/videoItem';

describe('styleParam - showVideoControls', () => {
  let driver;
  let sampleItem;
  let sampleItemViewProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    sampleItem = videoItems[0];
    sampleItemViewProps = driver.props.itemView(sampleItem);
  });

  it('should have video with controls when showVideoControls=true', async () => {
    Object.assign(sampleItemViewProps, {
      loadVideo: true,
    });
    Object.assign(sampleItemViewProps.styleParams, {
      showVideoControls: true,
    });
    driver.mount(VideoItem, sampleItemViewProps);
    await driver.update(200);
    console.log(driver.find.selector('ReactPlayer').props());
    const playerProps = driver.find.selector('ReactPlayer').props();
    expect(playerProps.controls).toBe(true);
  });

  it('should not have video with controls when showVideoControls=false', async () => {
    Object.assign(sampleItemViewProps, {
      loadVideo: true,
    });
    Object.assign(sampleItemViewProps.styleParams, {
      showVideoControls: false,
    });
    driver.mount(VideoItem, sampleItemViewProps);
    await driver.update(200);
    console.log(driver.find.selector('ReactPlayer').props());
    const playerProps = driver.find.selector('ReactPlayer').props();
    expect(playerProps.controls).toBe(false);
  });
});
