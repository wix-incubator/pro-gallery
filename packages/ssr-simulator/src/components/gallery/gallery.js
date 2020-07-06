import React from 'react';
import { ProGallery } from 'pro-gallery';
import { testItems } from './images';
import { resizeMediaUrl } from './itemResizer';
import * as utils from './utils';
import { GALLERY_CONSTS } from 'pro-gallery';

export default class Gallery extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleResize = this.handleResize.bind(this);
    const container = {
      width: 1920,
      height: 730
    };

    this.state = {
      isClient: false,
      container: container
    };
  }

  handleResize = () => {
    const container = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    this.setState({
      container
    });
  };

  componentDidMount() {
    this.setState({ isClient: true });
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const { isClient, container } = this.state;
    const viewMode = isClient
      ? GALLERY_CONSTS.viewMode.SITE
      : GALLERY_CONSTS.viewMode.PRERENDER;
    const searchString = this.props.location || window.location.search;
    const urlStyles = utils.getStyleParamsFromUrl(searchString);
    const hasUrlStyles = Object.keys(urlStyles).length > 0;
    const styles = hasUrlStyles ? urlStyles : utils.defaultStyleParams;

    const items = utils.mixAndSlice(testItems, 50, styles.seed || 1);
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
          allowSSR={!!urlStyles.allowSSR}
          useBlueprints={!!urlStyles.useBlueprints}
          container={container}
          viewMode={viewMode}
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
