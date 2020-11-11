import { defaultStyles } from 'pro-gallery-lib';

const styleParams = defaultStyles;
const container = {
    width: 1150,
    height: 850,
    scrollBase: 0
};

const customRenderers = {
    customHoverRenderer: () => {},
    customInfoRenderer: () => {},
    customSlideshowInfoRenderer: () => {},
}

export { container, styleParams, customRenderers }
