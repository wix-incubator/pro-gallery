import React from 'react';
import { utils, defaultStyles } from 'pro-gallery-lib';
import ProGallery from './proGallery/proGallery';
import basePropTypes from './proGallery/propTypes';

export default class BaseGallery extends React.Component {
  static propTypes = basePropTypes;

  constructor(props) {
    super(props);
    this.domId = props.domId || 'default-dom-id';
  }

  render() {
    const {
      styles,
      options,
      styleParams,
      eventsListener,
      ...otherProps
    } = this.props;
    const _eventsListener = (...args) =>
      typeof eventsListener === 'function' && eventsListener(...args);
    const _styles = { ...defaultStyles, ...options, ...styles, ...styleParams }; //TODOVER3 can we remove the default styles?? blueprints should take care of it
    let galleryProps = {
      ...otherProps,
      styles: _styles,
      eventsListener: _eventsListener,
      domId: this.domId,
    };

    utils.logPlaygroundLink(galleryProps.styles);

    if (
      galleryProps.styles &&
      galleryProps.items &&
      galleryProps.container &&
      galleryProps.structure
    ) {
      return <ProGallery {...galleryProps} />;
    } else {
      return null;
    }
  }
}
