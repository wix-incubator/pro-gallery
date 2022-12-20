import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { options, container } from '../drivers/mocks/styles';

const getExpectedCalcExpression = (expectedInfoSpace) => {
  return `calc(50%+0px-19.5px-${expectedInfoSpace}px)`;
};

describe('styleParam - layoutParams_navigationArrows_verticalAlignment', () => {
  let driver;
  let initialProps = {
    container,
    items: images2,
    options,
    customComponents: {
      customHoverRenderer: () => {},
      customInfoRenderer: () => {},
      customSlideshowInfoRenderer: () => {},
    },
  };

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container,
      items: images2,
      options: {
        ...options,
        [optionsMap.layoutParams.structure.itemSpacing]: 0, //v5 TODO test w/o and remove, should be handled by the new addPresetStyles of slideshow.
        [optionsMap.layoutParams.info.placement]:
          GALLERY_CONSTS[optionsMap.layoutParams.info.placement].BELOW, //v5 TODO test w/o and remove, should be handled by the new addPresetStyles of slideshow.
      },
      customComponents: {
        customHoverRenderer: () => {},
        customInfoRenderer: () => {},
        customSlideshowInfoRenderer: () => {},
      },
    };
    //base layout styles for entire test-suite
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout]
          .SLIDESHOW,
      [optionsMap.layoutParams.info.height]: 39,
    });
  });

  afterEach(() => {
    driver.detach.proGallery();
  });

  async function mountGallery(props) {
    driver.mount.proGallery(props);
    await driver.update();
  }

  async function mountGalleryAndGetArrows(props) {
    await mountGallery(props); // mounting gallery
    return driver.find.selector('.nav-arrows-container'); // Getting the arrows
  }

  it('Should not render the arrows when not enough info space', async () => {
    // Exact style params relevant to this sub-test
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.info.height]: 38, // info height is 39 when default, so slideshowInfoSize < layoutParams_navigationArrows_size
      [optionsMap.layoutParams.navigationArrows.verticalAlignment]:
        GALLERY_CONSTS[
          optionsMap.layoutParams.navigationArrows.verticalAlignment
        ].INFO_CENTER,
    });
    const navArrows = await mountGalleryAndGetArrows(initialProps);
    expect(navArrows).to.have.lengthOf(0);
  });

  it('Checks if "INFO_CENTER" has correct distance from top for SlideShow', async () => {
    // Exact style params relevant to this sub-test
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.navigationArrows.verticalAlignment]:
        GALLERY_CONSTS[
          optionsMap.layoutParams.navigationArrows.verticalAlignment
        ].INFO_CENTER,
      [optionsMap.layoutParams.info.height]: 39,
    });
    const navArrows = await mountGalleryAndGetArrows(initialProps);
    const galleryContainer = driver.getContainer();
    const { height: galleryHeight } = galleryContainer.props().style;
    const { top } = navArrows.props().style;
    const expectedInfoSpace =
      (-1 * galleryHeight) / 2 +
      initialProps.options[optionsMap.layoutParams.info.height] / 2;
    expect(top.replace(/\s/g, '')).to.eq(
      getExpectedCalcExpression(expectedInfoSpace)
    );
  });

  it('Checks if "ITEM_CENTER" has correct distance from top for SlideShow', async () => {
    // Exact style params relevant to this sub-test
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.navigationArrows.verticalAlignment]:
        GALLERY_CONSTS[
          optionsMap.layoutParams.navigationArrows.verticalAlignment
        ].ITEM_CENTER,
      [optionsMap.layoutParams.info.height]: 39,
    });
    const navArrows = await mountGalleryAndGetArrows(initialProps);
    const { top } = navArrows.props().style;
    expect(top.replace(/\s/g, '')).to.eq(getExpectedCalcExpression(0));
  });

  it('Checks if "IMAGE_CENTER" has correct distance from top for SlideShow', async () => {
    // Exact style params relevant to this sub-test
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.navigationArrows.verticalAlignment]:
        GALLERY_CONSTS[
          optionsMap.layoutParams.navigationArrows.verticalAlignment
        ].IMAGE_CENTER,
    });
    const navArrows = await mountGalleryAndGetArrows(initialProps);
    const { top } = navArrows.props().style;
    const expectedInfoSpace =
      initialProps.options[optionsMap.layoutParams.info.height] / 2;
    expect(top.replace(/\s/g, '')).to.eq(
      getExpectedCalcExpression(expectedInfoSpace)
    );
  });
});
