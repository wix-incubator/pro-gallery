import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2, videoItems } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles'

describe('styleParam - allowTitle', () => {

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
        const item = driver.find.hook('item-title').at(0);
        // first item has a title
        expect(item).to.have.lengthOf(1);
    });

    it('should not render "item-title" when "allowTitle" is "true" and item does not have a title', () => {
        Object.assign(initialProps.styles, {
            allowTitle: true,
        })
        driver.mount.proGallery(initialProps)
        const item = driver.find.hook('item-title').at(3);
        // last item does not have a title
        expect(item).to.have.lengthOf(0);
        
    });

    it('should not render "item-title when "allowTitle is "false"', () => {
        Object.assign(initialProps.styles, {
            allowTitle: false,
        })
        driver.mount.proGallery(initialProps);
        const items = driver.find.hook('item-title');
        expect(items).to.have.lengthOf(0);
    });

})