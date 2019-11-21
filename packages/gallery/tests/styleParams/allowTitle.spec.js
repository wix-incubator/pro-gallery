import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles'

describe('styleParam - allowTitle', () => {

<<<<<<< HEAD
    let driver;
    const initialProps = {
        container,
        items: images2,
        styles: styleParams
    }

    beforeEach(() => {
        driver = new GalleryDriver();
    });
    

    it('should render "item-title" when "allowTitle" is "true" and item has a title', () => {
        Object.assign(initialProps.styles, {
            allowTitle: true,
        })
        driver.mount.proGallery(initialProps)
        // first item has a title
        const item = driver.find.hook('item-title').at(0);
        expect(item).to.have.lengthOf(1);
        driver.detach.proGallery()
    });

    it('should not render "item-title" when "allowTitle" is "true" and item does not have a title', () => {
        Object.assign(initialProps.styles, {
            allowTitle: true,
        })
        driver.mount.proGallery(initialProps)
        // last item does not have a title
        const item = driver.find.hook('item-title').at(3);
        expect(item).to.have.lengthOf(0);
        driver.detach.proGallery()
        
    });

    it('should not render "item-title when "allowTitle" is "false"', () => {
        Object.assign(initialProps.styles, {
            allowTitle: false,
        })
        driver.mount.proGallery(initialProps);
        const items = driver.find.hook('item-title');
        expect(items).to.have.lengthOf(0);
        driver.detach.proGallery()
    });
=======
  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });


  it('should render "item-title" when "allowTitle" is "true" and item has a title', () => {
    Object.assign(initialProps.styles, {
      allowTitle: true,
    })
    driver.mount.proGallery(initialProps)
    // first item has a title
    const item = driver.find.hook('item-title').at(0);
    expect(item).to.have.lengthOf(1);
    driver.detach.proGallery();
  });

  it('should not render "item-title" when "allowTitle" is "true" and item does not have a title', () => {
    Object.assign(initialProps.styles, {
      allowTitle: true,
    })
    driver.mount.proGallery(initialProps)
    // last item does not have a title
    const item = driver.find.hook('item-title').at(3);
    expect(item).to.have.lengthOf(0);
    driver.detach.proGallery();
  });

  it('should not render "item-title when "allowTitle" is "false"', () => {
    Object.assign(initialProps.styles, {
      allowTitle: false,
    })
    driver.mount.proGallery(initialProps);
    const items = driver.find.hook('item-title');
    expect(items).to.have.lengthOf(0);
    driver.detach.proGallery();
  });

  it('should render wrapping "texts" element when only a title is available', () => {
    Object.assign(initialProps.styles, {
      allowDescription: false,
      allowTitle: true
    })
    driver.mount.proGallery(initialProps);
    const items = driver.find.selector('.gallery-item-text').at(0);
    expect(items).to.have.lengthOf(1);
    driver.detach.proGallery();
  });
>>>>>>> master

})