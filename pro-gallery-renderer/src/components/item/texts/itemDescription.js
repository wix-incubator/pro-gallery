import React from 'react';

export default class ItemDescription extends React.Component {

  render() {
    const {description, style, spanStyle} = this.props;
    const divStyle = Object.assign(style, {'-webkit-box-orient': 'vertical'});
    return (
      <div className={'gallery-item-description'} data-hook="item-description" style={divStyle}>{
        description.split('\n').map((i, key) => {
          return <span key={key} style={spanStyle}>{i}<br></br></span>;
        })
      }</div>
    );
  }
}
