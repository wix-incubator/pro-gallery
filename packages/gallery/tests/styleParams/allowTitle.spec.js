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

    });
    it('should not render "item-title" when "allowTitle" is "true" and item does not have a title', () => {

    });
    it('should not render "item-title when "allowTitle is "false"', () => {
        
    });

})