import React from 'react';

import ItemView from './itemView.js';
import {CommonItemContainer} from './commonItemContainer.js';

class ItemContainer extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.displayName = 'ItemContainer';

  }

  isSmallItem() {
    const maxWidth = 90;
    const maxHeight = 90;

    if (this.props.styleParams.cubeImages && this.props.styleParams.cubeType == 'fit') {
      if (this.props.style.orientation == 'landscape') {
        //wide image
        return (this.props.style.width / this.props.style.ratio <= maxHeight);
      } else {
        //tall image
        return (this.props.style.height * this.props.style.ratio <= maxWidth);
      }
    } else {
      return ((this.props.style.width <= maxWidth) || (this.props.style.height <= maxHeight));
    }
  }

  isNarrow() {
    return this.props.style.width < 200;
  }

  isShort() {
    return this.props.style.height < 150;
  }

  render() {
    this.props.love.showCounter = this.props.styleParams.loveCounter && !this.isSmallItem() && !this.isNarrow();
    return (
        <ItemView
            layout="galleryItem"
            className="image"
            isSmallItem={this.isSmallItem()}
            isNarrow={this.isNarrow()}
            isShort={this.isShort()}
            {...this.props}
        />
    );
  }
}

export default CommonItemContainer(ItemContainer);
