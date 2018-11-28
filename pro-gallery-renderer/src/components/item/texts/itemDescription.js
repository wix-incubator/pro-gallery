import React from 'react';

export default class ItemDescription extends React.Component {

  render() {
    const {description, style} = this.props;
    return (
      <div className={'gallery-item-description'} data-hook="item-description">{
        description.split('\n').map((i, key) => {
          return <span key={key} style={style}>{i}<br></br></span>;
        })
      }</div>
    );
  }
}
