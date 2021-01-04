import React from 'react';
import { defaultStyles, BlueprintsManager } from 'pro-gallery-lib';
import ProGallery from './proGallery/proBlueprintsGallery';
import basePropTypes from './proGallery/propTypes';

const blueprintsManager = new BlueprintsManager({ id: 'layoutingGallery' });
export default class BaseGallery extends React.Component {
  constructor(props) {
    super();
    this.domId = props.domId || 'default-dom-id';
    this.state = {
      blueprint: null,
    };
    blueprintsManager.init({
      api: {
        isUsingCustomInfoElements: () =>
          props.customHoverRenderer ||
          props.customInfoRenderer ||
          props.customSlideshowInfoRenderer,
      },
    });
    this.onNewProps(props);
  }

  static propTypes = basePropTypes;
  onNewProps(props) {
    const {
      styles,
      options,
      styleParams,
      eventsListener,
      ...otherProps
    } = props;
    const _eventsListener = (...args) =>
      typeof eventsListener === 'function' && eventsListener(...args);
    const _styles = { ...defaultStyles, ...options, ...styles, ...styleParams };
    this.galleryProps = {
      ...otherProps,
      styles: _styles,
      eventsListener: _eventsListener,
      domId: this.domId,
    };

    blueprintsManager
      .createBlueprint(this.galleryProps)
      .then((blueprint) => {
        console.log({blueprint});
        this.setState({ blueprint });
      })
      .catch((e) => {
        console.error('Could not breate a blueprints in layoutingIndex ', e);
      });
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    this.onNewProps(newProps);
  }

  render() {
    const { blueprint } = this.state;

    if (blueprint && Object.keys(blueprint).length > 0) {
      return <ProGallery {...this.galleryProps} {...blueprint} />;
    } else {
      return null;
    }
  }
}
