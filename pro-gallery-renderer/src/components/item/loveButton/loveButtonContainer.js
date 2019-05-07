import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../../actions/LoveButtonActions.js';
import {LoveButton} from './loveButton.js';

export const LoveButtonContainer = props => {

  return (
    <LoveButton
      toggleLove={props.actions.toggleLove}
      photoId={props.photoId}
      showCounter={props.showCounter}
      isLoved={props.isLoved}
      count={props.count}
      device={props.device}
      layout={props.layout}
      isStoreGallery={props.isStoreGallery}
    />
  );
};

function mapStateToProps(state) {
  return state.loveButton;
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoveButtonContainer);

