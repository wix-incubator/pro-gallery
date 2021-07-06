import React from 'react';
import { GALLERY_CONSTS, ProGallery, ProGalleryRenderer } from 'pro-gallery';
import { testItems, monochromeImages } from './images';
import { resizeMediaUrl } from './itemResizer';
import * as utils from './utils';

const UNKNOWN_DIMENSIONS = {
  width: 980,
  height: 500,
};
export default class Gallery extends React.PureComponent {
  constructor(props) {
    super(props);

    const dimensions = this.getDimensionsFromUrl(props);

    this.handleResize = this.handleResize.bind(this);

    this.state = {
      knownDimensions:
        (dimensions.width > 0 || dimensions.height > 0) &&
        dimensions !== UNKNOWN_DIMENSIONS,
      dimensions: dimensions,
    };
  }

  getDimensionsFromUrl(props) {
    let dimensions = UNKNOWN_DIMENSIONS;

    const { urlParams: { containerWidth, containerHeight } = {} } = props;
    if (containerWidth !== undefined && containerHeight !== undefined) {
      dimensions = {
        width: containerWidth,
        height: containerHeight,
      };
    }

    return dimensions;
  }

  getWindowDimensions() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  handleResize = () => {
    const dimensions = this.getWindowDimensions();

    this.setState({
      dimensions,
    });
  };

  shouldUpdateDimensionsOnMount = () => {
    let shouldUpdateDimensions = true;
    const { urlParams: { containerWidth, containerHeight } = {} } = this.props;
    const windowDimensions = this.getWindowDimensions();

    if (containerWidth !== undefined && containerHeight !== undefined) {
      if (
        windowDimensions.width === containerWidth &&
        windowDimensions.height === containerHeight
      ) {
        shouldUpdateDimensions = false;
      }
    }

    return shouldUpdateDimensions;
  };

  isSSR() {
    return typeof window === 'undefined';
  }

  componentDidMount() {
    const newState = { knownDimensions: true };

    if (this.shouldUpdateDimensionsOnMount()) {
      newState.dimensions = this.getWindowDimensions();
    }

    this.setState(newState);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const { urlParams } = this.props;
    const { knownDimensions, dimensions } = this.state;
    const viewMode =
      !knownDimensions || this.isSSR()
        ? GALLERY_CONSTS.viewMode.PRERENDER
        : GALLERY_CONSTS.viewMode.SITE;

    const containerClassName =
      viewMode === GALLERY_CONSTS.viewMode.PRERENDER ? 'no-transition' : '';

    const hasUrlStyles = Object.keys(urlParams).length > 0;
    const styles = hasUrlStyles ? urlParams : utils.defaultStyleParams;

    const items = urlParams.isTestEnvironment ?
      monochromeImages.slice(0, 20) :
      testItems.slice(0, 50); //utils.mixAndSlice(testItems, 50, styles.seed || 1);
    // The eventsListener will notify you anytime something has happened in the gallery.
    const eventsListener = (eventName, eventData) => {
      // console.log({eventName, eventData});
    };

    // if (typeof nothing !== 'undefined') {
    //   import ('./layoutFixer').then(console.warn);
    // }
    const Gallery =
      this.isSSR() || !urlParams.useBlueprints
        ? ProGallery
        : ProGalleryRenderer;
    return (
      <div className={containerClassName}>
        <Gallery
          domId="ssr-simulator"
          items={items}
          styles={styles}
          settings={{
            disableSSROpacity: !!urlParams.disableSSROpacity,
            avoidInlineStyles: !urlParams.useLayoutFixer,
          }}
          dimensions={dimensions}
          viewMode={viewMode}
          isPrerenderMode={true}
          eventsListener={eventsListener}
          resizeMediaUrl={resizeMediaUrl}
          useBlueprints={true}
        />
      </div>
    );
  }
}

// Enjoy using your new gallery!
// For more options, visit https://github.com/wix/pro-gallery
