/* eslint-disable prettier/prettier */
import React from 'react';
import { utils, defaultStyles } from 'pro-gallery-lib';
import ProGallery from './proGallery/proGallery';
import { GalleryRendererProps } from 'pro-gallery-lib';

export default class GalleryRenderer extends React.Component<GalleryRendererProps> {
  render() {
    const { id, styles, options, styleParams, eventsListener, customComponents, ...otherProps } =
      this.props;

    const _eventsListener = (eventName, eventData) =>
      typeof eventsListener === 'function' && eventsListener(eventName, eventData);

    const _styles = { ...defaultStyles, ...options, ...styles, ...styleParams }; //TODOVER3 can we remove the default styles?? blueprints should take care of it

    const galleryRendererProps = {
      ...otherProps,
      styles: _styles,
      eventsListener: _eventsListener,
      id: id || 'default-dom-id',
      customComponents: customComponents || {},
    };

    utils.logPlaygroundLink(galleryRendererProps.styles);

    if (
      galleryRendererProps.styles &&
      galleryRendererProps.items &&
      galleryRendererProps.container &&
      galleryRendererProps.structure
    ) {
      return <ProGallery {...galleryRendererProps} />;
    } else {
      return null;
    }
  }
}
/* eslint-enable prettier/prettier */
