import React from 'react';
import { ProGallery } from 'pro-gallery';
import { testItems } from './images';
import { resizeMediaUrl } from './itemResizer';
import * as utils from './utils';
import { GALLERY_CONSTS } from 'pro-gallery';
import 'pro-gallery/dist/statics/main.css';

const UNKNOWN_CONTAINER = {
  width: 980,
  height: 500
};
export default class Gallery extends React.PureComponent {
  constructor(props) {
    super(props);

    const container = this.getContainerFromUrl(props);

    this.handleResize = this.handleResize.bind(this);

    this.state = {
      knownContainer: container !== UNKNOWN_CONTAINER,
      container: container
    };
  }

  getContainerFromUrl(props) {
    let container = UNKNOWN_CONTAINER;

    const { urlParams: { containerWidth, containerHeight } = {} } = props;
    if (containerWidth !== undefined && containerHeight !== undefined) {
      container = {
        width: containerWidth,
        height: containerHeight
      };
    }

    return container;
  }

  getContainerFromWindowDimensions() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  handleResize = () => {
    const container = this.getContainerFromWindowDimensions();

    this.setState({
      container
    });
  };

  shouldUpdateContainerOnMount = () => {
    let shouldUpdateContainer = true;
    const { urlParams: { containerWidth, containerHeight } = {} } = this.props;
    const containerWithWindowDimensions = this.getContainerFromWindowDimensions();

    if (containerWidth !== undefined && containerHeight !== undefined) {
      if (
        containerWithWindowDimensions.width === containerWidth &&
        containerWithWindowDimensions.height === containerHeight
      ) {
        shouldUpdateContainer = false;
      }
    }

    return shouldUpdateContainer;
  };

  isSSR() {
    return typeof window === 'undefined';
  }

  componentDidMount() {
    const newState = { knownContainer: true };

    if (this.shouldUpdateContainerOnMount()) {
      newState.container = this.getContainerFromWindowDimensions();
    }

    this.setState(newState);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const { urlParams } = this.props;
    const { knownContainer, container } = this.state;
    const viewMode =
      !knownContainer || this.isSSR()
        ? GALLERY_CONSTS.viewMode.PRERENDER
        : GALLERY_CONSTS.viewMode.SITE;
    const containerClassName =
      viewMode === GALLERY_CONSTS.viewMode.PRERENDER ? 'no-transition' : '';

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
      <div className={containerClassName}>
        <ProGallery
          domId="ssr-simulator"
          items={items}
          styles={styles}
          useBlueprints={!!urlParams.useBlueprints}
          container={container}
          viewMode={viewMode}
          eventsListener={eventsListener}
          resizeMediaUrl={resizeMediaUrl}
        />
      </div>
    );
  }
}

// Enjoy using your new gallery!
// For more options, visit https://github.com/wix/pro-gallery
