import React from 'react';

import ItemView from './itemView.js';
import { CommonItemContainer } from './commonItemContainer.js';

class ItemContainer extends React.Component {
  render() {
    return <ItemView layout="galleryItem" className="image" {...this.props} />;
  }
}

export default CommonItemContainer(ItemContainer);
