import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

const aboveAndBelowPlacements = ['SHOW_ABOVE', 'SHOW_BELOW'];

describe('styleParam - arrowsVerticalPosition', () => {
  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams,
  };

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('Should not render the arrows when not enough info space', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      slideshowInfoSize: 38, // info height is 39 when default, so should not render the arrows
      arrowsVerticalPosition: 'INFO_CENTER',
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const navArrows = driver.find.selector('.nav-arrows-container');
    expect(navArrows).to.have.lengthOf(0);
    driver.detach.proGallery();
  });

  // Checks if INFO_CENTER is good on layouts with above/below
  it('Checks if has correct distance from top for SlideShow and above/below placements', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      slideshowInfoSize: 39, // info height is 39 when default, so should not render the arrows
      arrowsVerticalPosition: 'INFO_CENTER',
    });
    for (const placement in aboveAndBelowPlacements) {
      Object.assign(initialProps.styles, {
        titlePlacement: placement,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const navArrows = driver.find
        .selector('.nav-arrows-container')
        .getElement();
      const galleryContainer = driver.find
        .selector('#pro-gallery-container')
        .getElement();
      const directionOfInfoSpace = placement === 'SHOW_ABOVE' ? 1 : -1;
      const { height: galleryHeight } = galleryContainer.props.style;
      const { top } = navArrows.props.style;
      const expectedInfoSpace = galleryHeight / 2;
      expect(top).to.eq(
        `calc(50% - 19.5px + 0px - ${
          directionOfInfoSpace * expectedInfoSpace
        }px)`
      );
      driver.detach.proGallery();
    }
  });

  it('Checks if has correct distance from top for columns and above/below placements', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDER,
      slideshowInfoSize: 39, // info height is 39 when default, so should not render the arrows
      arrowsVerticalPosition: 'INFO_CENTER',
    });
    for (const placement in aboveAndBelowPlacements) {
      Object.assign(initialProps.styles, {
        titlePlacement: 'SHOW_ABOVE',
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const navArrows = driver.find
        .selector('.nav-arrows-container')
        .getElement();
      const galleryContainer = driver.find
        .selector('#pro-gallery-container')
        .getElement();
      const directionOfInfoSpace = placement === 'SHOW_ABOVE' ? 1 : -1;
      const { height: galleryHeight } = galleryContainer.props.style;
      const { top } = navArrows.props.style;
      console.error(navArrows);
      const expectedInfoSpace =
        (galleryHeight - initialProps.styles.textBoxHeight) / 2;
      expect(top).to.eq(
        `calc(50% - 19.5px + 2.5px - ${
          directionOfInfoSpace * expectedInfoSpace
        }px)`
      );
      driver.detach.proGallery();
    }
  });
});
