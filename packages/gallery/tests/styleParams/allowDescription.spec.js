import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles'

describe('styleParam - allowDescription', () => {

    let driver;
    const initialProps = {
        container,
        items: images2,
        styles: styleParams
    }

    beforeEach(() => {
        driver = new GalleryDriver();
    });
    

    it('should render "item-description" when "allowDescription" is "true" and item has a description', () => {
        Object.assign(initialProps.styles, {
            allowDescription: true,
        })
        driver.mount.proGallery(initialProps)
        // first item has a description
        const item = driver.find.hook('item-description').at(0);
        expect(item).to.have.lengthOf(1);
<<<<<<< HEAD
        driver.detach.proGallery()
=======
        driver.detach.proGallery();
>>>>>>> master
    });

    it('should not render "item-description" when "allowDescription" is "true" and item does not have a description', () => {
        Object.assign(initialProps.styles, {
            allowDescription: true,
        })
        driver.mount.proGallery(initialProps)
        // last item does not have a description
        const item = driver.find.hook('item-description').at(3);
        expect(item).to.have.lengthOf(0);
<<<<<<< HEAD
        driver.detach.proGallery()
        
=======
        driver.detach.proGallery();
>>>>>>> master
    });

    it('should not render "item-description" when "allowDescription" is "false"', () => {
        Object.assign(initialProps.styles, {
            allowDescription: false,
        })
        driver.mount.proGallery(initialProps);
        const items = driver.find.hook('item-description');
        expect(items).to.have.lengthOf(0);
<<<<<<< HEAD
        driver.detach.proGallery()
=======
        driver.detach.proGallery();
>>>>>>> master
    });

    it('should render wrapping "texts" element when only a description is available', () => {
      Object.assign(initialProps.styles, {
          allowDescription: true,
          allowTitle: false
      })
      driver.mount.proGallery(initialProps);
      const items = driver.find.selector('.gallery-item-text').at(0);
      expect(items).to.have.lengthOf(1);
      driver.detach.proGallery();
  });
})