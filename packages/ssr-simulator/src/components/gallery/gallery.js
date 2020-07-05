import React from 'react';
import { ProGallery } from 'pro-gallery';
import { testItems } from './images';
import { resizeMediaUrl } from './itemResizer';
import * as utils from './utils';

export default class Gallery extends React.PureComponent {
  constructor(props) {
    super();
    this.state = {
      container: this.getDefaultContainer(props)
    }

    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.handleResize);
  }

  getDefaultContainer(props) {
    let container = {
      width: 980,
      height: 500
    }

    const { urlParams : { containerWidth, containerHeight} = {}} = props;
    if (containerWidth !== undefined && containerHeight !== undefined){
      container = {
        width: containerWidth,
        height: containerHeight
      }
    } else if (typeof window !== 'undefined'){
      container = {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }

    return container;
  }

  handleResize = () => {
    const container = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    this.setState({
      container
    })
  };

  render() {
    const { urlParams} = this.props

    const hasUrlStyles = Object.keys(urlParams).length > 0;
    const styles = hasUrlStyles ? urlParams : utils.defaultStyleParams;

    const items = utils.mixAndSlice(testItems, 50, styles.seed || 1);

    // The eventsListener will notify you anytime something has happened in the gallery.
    const eventsListener = (eventName, eventData) => {
      // console.log({eventName, eventData});
    };

    // The size of the gallery container. The images will fit themselves in it
    const { container } = this.state;

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
