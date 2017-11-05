import React from 'react';
import CustomButtonIcon from './customButtonIcon.js';
import {utils} from '../../../utils/index.js';

export default class CustomButton extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {styleParams} = this.props;
    const defaultText = utils.isStoreGallery() ? 'Buy Now' : 'Click here';
    const buttonText = styleParams.customButtonText || defaultText;
    return (
      <div className="custom-button-wrapper" style={{justifyContent: styleParams.galleryHorizontalAlign}}>
        {this.props.small ?
          <CustomButtonIcon /> :
          <button onClick={() => logger.trackBi(logger.biEvents.buyNowClick)}
            tabIndex={-1}
          >
            {buttonText}
            <div className="overlay"></div>
          </button>
        }
      </div>
    );
  }
}
