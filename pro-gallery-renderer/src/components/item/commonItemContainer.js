import React from 'react';
import {
  videoEnded,
  videoAdded,
  videoRemoved,
} from '../../actions/galleryActions.js';
import { playVideo, pauseVideo } from '../../actions/itemViewActions.js';
import { connect } from 'react-redux';
import { GalleryComponent } from '../galleryComponent';

export const CommonItemContainerNotConnected = ComposedComponent => {
  class InnerComponent extends GalleryComponent {
    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  return InnerComponent;
};

export const CommonItemContainer = ComposedComponent => {
  const commonItemContainerNotConnected = CommonItemContainerNotConnected(
    ComposedComponent,
  );

  const mapStateToProps = (state, ownProps) => {
    const galleryState = state.gallery || {};
    return {
      playing: galleryState.videoIndexPlay === ownProps.idx,
      documentHeight: galleryState.documentHeight,
      previewHover: galleryState.previewHover,
    };
  };

  return connect(
    mapStateToProps,
    { videoEnded, videoAdded, videoRemoved, playVideo, pauseVideo },
  )(commonItemContainerNotConnected);
};
