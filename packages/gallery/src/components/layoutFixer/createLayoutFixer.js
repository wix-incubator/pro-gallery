
// import { createLayout } from 'pro-layouts';
import { createLayout } from 'pro-layouts';

export const createLayoutFixer = (resizeMediaUrl) => {
    const convertDtoToLayoutItem = (dto) => {
        const isLayoutItem = !!(dto.id && dto.width > 0 && dto.height > 0);
        if (isLayoutItem) {
            return dto;
        } else {
            const metadata = dto.metadata || dto.metaData;
            return {
                id: dto.itemId || dto.photoId,
                width: metadata.width,
                height: metadata.height,
                ...dto,
            };
        }
    }

    // const setAttributes = (node, attributes) =>
    //     node &&
    //     attributes &&
    //     Object.keys(attributes).forEach((attr) =>
    //         node.setAttribute(attr, attributes[attr]),
    //     );

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
        height: item.height + (styleParams.externalInfoHeight || 0) + 'px',
        margin: 0
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

    const createWebComponent = () => {
        console.log('[LAYOUT FIXER] createWebComponent');
        class LayoutFixerElement extends HTMLElement {
            constructor() {
                super();
                this.retries = 3;
                this.connectedCallback = this.connectedCallback.bind(this);
                if (!window.layoutFixer) {
                    window.layoutFixer = {};
                }
            }

            retry() {
                if (this.retries > 0) {
                    this.retries--;
                    console.log('[LAYOUT FIXER] retrying...', this.retries);
                    window.requestAnimationFrame(this.connectedCallback);
                } else {
                    console.log('[LAYOUT FIXER] reached retries limit');
                }
            }

            connectedCallback() {
                this.domId = this.getAttribute('domId');
                if (!window.layoutFixer[this.domId]) {
                    window.layoutFixer[this.domId] = {}
                } else if (window.layoutFixer[this.domId].done) {
                    return;
                }
                console.log('[LAYOUT FIXER] connectedCallback');
                this.parentId = 'pro-gallery-' + this.domId;
                this.parent = document.getElementById(this.parentId);
                if (!this.parent) {
                    console.log('[LAYOUT FIXER] no parent found', this.parent);
                    this.retry();
                    return;
                } else {
                    console.log('[LAYOUT FIXER] parent found', this.parent);
                }

                this.useLayouter = true
                this.items = JSON.parse(this.getAttribute('items')).map(convertDtoToLayoutItem);
                if (!(this.items && this.items.length > 0)) {
                    this.useLayouter = false
                } else {
                    window.layoutFixer[this.domId].items = this.items;
                }

                this.styleParams = JSON.parse(this.getAttribute('styles'));

                if (!(this.styleParams && typeof this.styleParams === 'object')) {
                    this.useLayouter = false
                } else {
                    window.layoutFixer[this.domId].styles = this.styleParams;
                }

                const { width, height, top } = this.parent && this.parent.getBoundingClientRect();
                this.measures = {
                    top,
                    width,
                    height,
                    scrollBase: top,
                };
                window.layoutFixer[this.domId].container = this.measures;
                console.log('[LAYOUT FIXER] measured container', this.measures);

                if (this.measures && this.useLayouter && typeof createLayout === 'function') {
                    this.layout = createLayout({
                        items: this.items,
                        styleParams: this.styleParams,
                        container: this.measures
                    })
                    console.log('[LAYOUT FIXER] created layout', this.layout);
                    window.layoutFixer[this.domId].structure = this.layout;
                }

                if (this.useLayouter && this.layout && this.layout.items && this.layout.items.length > 0) {
                    const itemContainers = this.parent.querySelectorAll('.gallery-item-container');
                    const itemWrappers = this.parent.querySelectorAll('.gallery-item-wrapper');
                    const itemHighResImage = this.parent.querySelectorAll('[data-hook=gallery-item-image-img]');

                    if (itemWrappers.length > 0 && itemContainers.length > 0) {
                        if (typeof resizeMediaUrl === 'function') {
                            itemHighResImage.forEach(element => {
                                const idx = parseInt(element.getAttribute('data-idx'));
                                const item = this.items[idx];
                                const src = resizeMediaUrl(
                                    item,
                                    item.url || item.mediaUrl,
                                    this.styleParams.cubeImages && this.styleParams.cubeType === 'fit' ? 'fit' : 'fill',
                                    this.layout.items[idx].width,
                                    this.layout.items[idx].height,
                                );
                            
                                !idx && console.log('[LAYOUT FIXER] set first Image src Style', idx, src);
                                if (src) {
                                    element.setAttribute('src', src);
                                    setStyle(element, {opacity: 1});
                                }
                            })
                        }
                        
                        itemContainers.forEach((element, idx) => {
                            !idx && console.log('[LAYOUT FIXER] set first Container Style', idx, getItemContainerStyle(this.layout.items[idx], this.styleParams));
                            setStyle(element, getItemContainerStyle(this.layout.items[idx], this.styleParams))
                        })
                        
                        itemWrappers.forEach((element, idx) => {
                            !idx && console.log('[LAYOUT FIXER] set first Wrapper Style', idx, getItemWrapperStyle(this.layout.items[idx], this.styleParams));
                            setStyle(element, getItemWrapperStyle(this.layout.items[idx], this.styleParams))
                        })
                        
                        window.layoutFixer[this.domId].done = Date.now();
                        console.log('[LAYOUT FIXER] Done');
                    } else {
                        console.log('[LAYOUT FIXER] Cannot find elements', itemContainers, itemWrappers, this.parent);
                        this.retry();
                    }
                }
            }
        }
        window.customElements.define('layout-fixer', LayoutFixerElement);
    }

    if (typeof window !== 'undefined') {
        try {
            console.log('[LAYOUT FIXER] Start (script is running)');
            createWebComponent()
        } catch (e) {
            console.error('Cannot create layout fixer', e);
        }
    }
}