import React from 'react';
import { ProGallery } from 'pro-gallery';
import { testItems } from './images';
import { resizeMediaUrl } from './itemResizer';
import * as utils from './utils';

export default class Gallery extends React.Component {
  render() {
    const searchString = this.props.location || window.location.search;
    const urlStyles = utils.getStyleParamsFromUrl(searchString);
    const hasUrlStyles = Object.keys(urlStyles).length > 0;
    const styles = hasUrlStyles ? urlStyles : utils.defaultStyleParams;

    const items = utils.mixAndSlice(testItems, 50, styles.seed || 1);

    // The size of the gallery container. The images will fit themselves in it
    const container =
      typeof window === 'undefined'
        ? {
            width: '',
            height: 500
          }
        : {
            width: window.innerWidth,
            height: window.innerHeight
          };

    // The eventsListener will notify you anytime something has happened in the gallery.
    const eventsListener = (eventName, eventData) => {
      // console.log({eventName, eventData});
    };

    typeof window !== 'undefined' &&
      console.log('[SSR SIMULATOR] Rendering Gallery with params', {
        items,
        styles,
        container
      });

    return (
      <div>
        <ProGallery
          domId="ssr-simulator"
          items={items}
          styles={styles}
          allowSSR={true}
          container={container}
          eventsListener={eventsListener}
          resizeMediaUrl={resizeMediaUrl}
        />
        {/* <ol style={{display: 'none'}}>{Object.entries(styles).map(([key, val]) => <li>{key}: {val}</li>)}</ol> */}
      </div>
    );
  }
}

// Enjoy using your new gallery!
// For more options, visit https://github.com/wix/pro-gallery
