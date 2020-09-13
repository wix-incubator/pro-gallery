import React from 'react';
import {createLayout} from 'pro-layouts';
import { isPrerenderMode } from 'pro-gallery-lib';

let layoutFixerProps = {};

const setAttributes = (node, attributes) =>
  node &&
  attributes &&
  Object.keys(attributes).forEach((attr) =>
    node.setAttribute(attr, attributes[attr]),
  );

const addDefaultUnitIfNeeded = (prop, value) =>
  typeof value === 'number' ? `${value}px` : value;

const setStyle = (node, styleProperties) =>
  node &&
  styleProperties &&
  Object.keys(styleProperties).forEach((prop) => {
    const propValue = styleProperties[prop];
    if (propValue !== undefined) {
      node.style[prop] = addDefaultUnitIfNeeded(prop, propValue);
    } else {
      node.style.removeProperty(prop);
    }
  });

const getItemWrapperStyle = (item, styleParams) => ({
    width: item.width,
    height: item.height + (styleParams.externalInfoHeight || 0)
})

const getItemContainerStyle = (item, styleParams) => {
    const itemWrapperStyles = getItemWrapperStyle(item, styleParams)
    const {isRTL} = styleParams
    return {
        opacity: 1,
        top: item.offset.top,
        left: isRTL ? 'auto' : item.offset.left,
        right: !isRTL ? 'auto' : item.offset.left,
        ...itemWrapperStyles
    }
}

export class LayoutFixerElement extends HTMLElement {
    connectedCallback() {
        this.props = layoutFixerProps;
        this.parentId = this.props.parentId
        this.parent = this.parentId && document.getElementById(this.parentId)

        this.useLayouter = true
        this.items = this.props.items
        if (!(this.items && this.items.length > 0)) {
            this.useLayouter = false
        }

        this.styleParams = this.props.styleParams
        if (!(this.styleParams && typeof this.styleParams === 'object')) {
            this.useLayouter = false
        }

        this.measures = this.parent.getBoundingClientRect()
        if (this.useLayouter && typeof createLayout === 'function') {
            this.layout = createLayout({
                items: this.items,
                styleParams: this.styleParams,
                container: this.measures
            })
        }

        if (typeof this.measures === 'object') {
            setAttributes(this.parent, {
                'data-top': this.measures.top,
                'data-width': this.measures.width,
                'data-height': this.measures.height
            })
        }

        if (this.useLayouter && this.layout && this.layout.items && this.layout.items.length > 0) {
            this.parent.querySelectorAll('.gallery-item-container').forEach((element, idx) => {
                setStyle(element, getItemContainerStyle(this.layout.items[idx], this.styleParams))
            })
            this.parent.querySelectorAll('.gallery-item-wrapper').forEach((element, idx) => {
                setStyle(element, getItemWrapperStyle(this.layout.items[idx], this.styleParams))
            })
        }
    }
}


export const LayoutFixer = (props) => {
    layoutFixerProps = props;
    console.log('[LAYOUT FIXER] rendering', isPrerenderMode(), props);
    return isPrerenderMode() ? (
        <>
        <img 
            alt="" 
            style={{display: 'none'}}
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX/TQBcNTh/AAAAAXRSTlMAQObYZgAAAApJREFUeJxjYgAAAAYAAzY3fKgAAAAASUVORK5CYII=" //1px transparent png
            onLoad={() => {
                try {
                    window.customElements.define('layout-fixer', LayoutFixerElement);
                } catch (e) {
                    console.error('Cannot load layout fixer element', e)
                }
            }}/>
        <layout-fixer {...props}></layout-fixer>
        </>
    ) : null;
}