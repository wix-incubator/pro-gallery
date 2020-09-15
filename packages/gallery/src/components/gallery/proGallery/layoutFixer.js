import React from 'react';
import { createLayout } from 'pro-layouts';
import { isPrerenderMode } from 'pro-gallery-lib';

const setAttributes = (node, attributes) =>
    node &&
    attributes &&
    Object.keys(attributes).forEach((attr) =>
        node.setAttribute(attr, attributes[attr]),
    );

const setStyle = (node, styleProperties) =>
    node &&
    styleProperties &&
    Object.keys(styleProperties).forEach((prop) => {
        const propValue = styleProperties[prop];
        if (propValue !== undefined) {
            node.style[prop] = propValue;
        } else {
            node.style.removeProperty(prop);
        }
    });

const getItemWrapperStyle = (item, styleParams) => ({
    width: item.width + 'px',
    height: item.height + (styleParams.externalInfoHeight || 0) + 'px'
})

const getItemContainerStyle = (item, styleParams) => {
    const itemWrapperStyles = getItemWrapperStyle(item, styleParams)
    const { isRTL } = styleParams
    return {
        opacity: 1,
        top: item.offset.top + 'px',
        left: isRTL ? 'auto' : item.offset.left + 'px',
        right: !isRTL ? 'auto' : item.offset.left + 'px',
        ...itemWrapperStyles
    }
}

const createLayoutFixer = () => {
    if (window.layoutFixerCreated === true ) {
        return;
    }
    window.layoutFixerCreated = true;
    console.log('[LAYOUT FIXER] createLayoutFixer');
    class LayoutFixerElement extends HTMLElement {
        connectedCallback() {
            console.log('[LAYOUT FIXER] connectedCallback');
            this.parentId = this.getAttribute('parentid');
            this.parent = this.parentNode;// && document.getElementById(this.parentId)
            console.log('[LAYOUT FIXER] parent', this.parent);

            this.useLayouter = true
            this.items = JSON.parse(this.getAttribute('items'))
            if (!(this.items && this.items.length > 0)) {
                this.useLayouter = false
            }
            console.log('[LAYOUT FIXER] items', this.items.map(item => item.mediaUrl));

            this.styleParams = JSON.parse(this.getAttribute('styles'))
            if (!(this.styleParams && typeof this.styleParams === 'object')) {
                this.useLayouter = false
            }

            this.measures = this.parent && this.parent.getBoundingClientRect()
            if (this.measures && this.useLayouter && typeof createLayout === 'function') {
                this.layout = createLayout({
                    items: this.items,
                    styleParams: this.styleParams,
                    container: this.measures
                })
                console.log('[LAYOUT FIXER] layout', this.layout);
            }

            if (typeof this.measures === 'object') {
                console.log('[LAYOUT FIXER] measures', this.measures);
                setAttributes(this.parent, {
                    'data-top': this.measures.top,
                    'data-width': this.measures.width,
                    'data-height': this.measures.height
                })
            }

            if (this.useLayouter && this.layout && this.layout.items && this.layout.items.length > 0) {
                this.parent.querySelectorAll('.gallery-item-container').forEach((element, idx) => {
                    console.log('[LAYOUT FIXER] setStyle', idx, getItemContainerStyle(this.layout.items[idx], this.styleParams));
                    setStyle(element, getItemContainerStyle(this.layout.items[idx], this.styleParams))
                })
                this.parent.querySelectorAll('.gallery-item-wrapper').forEach((element, idx) => {
                    setStyle(element, getItemWrapperStyle(this.layout.items[idx], this.styleParams))
                })
            }
        }
    }
    console.log('[LAYOUT FIXER] customElements.define', window, window.customElements);
    window.customElements.define('layout-fixer', LayoutFixerElement);

}

if (typeof window !== 'undefined') {
    window.requestAnimationFrame(() => {
        try {
            createLayoutFixer() 
        } catch (e) {
            console.error('Cannot create layout fixer', e);
        }
    });
}

export const LayoutFixer = (props) => {
    console.log('[LAYOUT FIXER] rendering', isPrerenderMode(), props);
    return (isPrerenderMode()) ? (
        <layout-fixer 
            parentId={props.parentId}
            items={JSON.stringify(props.items)}
            styles={JSON.stringify(props.styles)}
        ></layout-fixer>
    ) : null;}