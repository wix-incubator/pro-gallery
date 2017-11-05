import React from 'react';

export default class ItemDescription extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {description} = this.props;
    return (
      <div className={'gallery-item-description'} data-hook="item-description">{description}</div>
    );
  }
}
