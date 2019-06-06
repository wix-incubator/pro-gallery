import React from 'react';
import {
  videoEnded,
  videoAdded,
  videoRemoved,
} from '../../actions/galleryActions.js';
import { playVideo, pauseVideo } from '../../actions/itemViewActions.js';
import { connect } from 'react-redux';
import window from '@wix/photography-client-lib/dist/src/sdk/windowWrapper';

export const CommonItemContainerNotConnected = ComposedComponent => {
  class InnerComponent extends React.Component {
    constructor(props, context) {
      super(props, context);

      this.updateLoveCount = this.updateLoveCount.bind(this);

      this.state = {
        isLoved: this.props.actions.itemActions.isLoved(props.photoId),
        loveCount: 0,
      };
    }

    componentDidMount() {
      window.addEventListener('love_count_fetched', this.updateLoveCount);
    }

    componentWillUnmount() {
      window.removeEventListener('love_count_fetched', this.updateLoveCount);
    }

    componentWillReceiveProps(nextProps) {
      const { photoId } = nextProps;
      this.setState({
        isLoved: this.props.actions.itemActions.isLoved(photoId),
        loveCount: this.props.actions.itemActions.getLoveCount(photoId),
      });
    }

    updateLoveCount() {
      this.setState({
        loveCount: this.props.actions.itemActions.getLoveCount(
          this.props.photoId,
        ),
      });
    }

    toggleLove() {
      this.props.actions.itemActions.postLoveActivity(this.props);
      this.props.actions.itemActions.toggleLove(this.props.photoId, 'gallery');
      this.setState({
        isLoved: !this.state.isLoved,
      });
    }

    render() {
      const { photoId } = this.props;
      const { isLoved, loveCount } = this.state;
      return (
        <ComposedComponent
          {...this.props}
          love={{
            isLoved,
            count: loveCount + (isLoved ? 1 : 0),
            toggleLove: this.toggleLove.bind(this),
          }}
        />
      );
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
