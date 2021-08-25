/* eslint-disable prettier/prettier */
import React from 'react';
import { utils, defaultOptions } from 'pro-gallery-lib';
import ProGallery from './proGallery/proGallery';
import { GalleryRendererProps } from 'pro-gallery-lib';

export default class GalleryRenderer extends React.Component<GalleryRendererProps> {
  render() {
    const { id, options, eventsListener, customComponents, ...otherProps } =
      this.props;

    const _eventsListener = (eventName, eventData) =>
      typeof eventsListener === 'function' && eventsListener(eventName, eventData);

    const _options = { ...defaultOptions, ...options }; //TODOVER3 can we remove the default options?? blueprints should take care of it

    const galleryRendererProps = {
      ...otherProps,
      options: _options,
      eventsListener: _eventsListener,
      id: id || 'default-dom-id',
      customComponents: customComponents || {},
    };

    utils.logPlaygroundLink(galleryRendererProps.options);

    if (
      galleryRendererProps.options &&
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
