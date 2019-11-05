import React from 'react';
import { mount, configure } from 'enzyme';
import ProGallery from '../../../src/components/gallery/proGallery'
import Adapter from 'enzyme-adapter-react-16'

configure({
    adapter: new Adapter()
})

class GalleryDriverNew {

    mountGallery(props) {
        const div = document.createElement('div');
        div.setAttribute('id', 'testing-container');
        document.body.appendChild(div);
        this.wrapper = mount(<ProGallery {...props} />, { attachTo: document.getElementById('testing-container') });
    }
    detachGallery() {
        this.wrapper.detach();
        const div = document.getElementById('testing-container');
        if (div) {
            document.body.removeChild(div);
        }
    }

    find() {
        return {
            hook: (attr, str) => {
                return this.wrapper.find(`[${attr}="${str}"]`);
            },
            selector: (str) => {
                return this.wrapper.find(str);
            }
        }
    }

    setProps(props,callback = ()=>{}){
        this.wrapper.setProps({...props},callback);
    }
    update(){
        this.wrapper.update();
    }
}

export default GalleryDriverNew;