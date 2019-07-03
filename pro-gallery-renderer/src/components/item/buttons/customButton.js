import React from 'react';
import CustomButtonIcon from './customButtonIcon.js';
import utils from '../../../utils/index.js';
import EVENTS from '../../../utils/constants/events';

export default class CustomButton extends React.Component {
  render() {
    const { styleParams } = this.props;
    const defaultText = utils.isStoreGallery() ? 'Buy Now' : 'Click here';
    const buttonText = styleParams.customButtonText || defaultText;
    return (
      <div
        className="custom-button-wrapper"
        style={{
          justifyContent: styleParams.galleryHorizontalAlign,
          zIndex: 17,
        }}
      >
        {this.props.small ? (
          <CustomButtonIcon />
        ) : (
          <button
            data-hook="custom-button-button"
            onClick={() =>
              this.props.actions.eventsListener(
                EVENTS.ON_BUY_NOW_CLICKED,
                this.props,
              )
            }
            tabIndex={-1}
          >
            {buttonText}
            <div className="overlay" />
          </button>
        )}
      </div>
    );
  }
}
