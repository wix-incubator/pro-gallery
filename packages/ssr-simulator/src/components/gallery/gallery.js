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
      width: 900,
      height: 500
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
    const { urlParams} = this.props;
    const { isClient, container } = this.state;
    const viewMode = isClient
      ? GALLERY_CONSTS.viewMode.SITE
      : GALLERY_CONSTS.viewMode.PRERENDER;

    const hasUrlStyles = Object.keys(urlParams).length > 0;
    const styles = hasUrlStyles ? urlParams : utils.defaultStyleParams;

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
          allowSSR={!!urlParams.allowSSR}
          useBlueprints={!!urlParams.useBlueprints}
          container={container}
          // viewMode={viewMode}
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
