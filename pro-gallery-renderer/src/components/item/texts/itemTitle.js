import React from 'react';

export default class ItemTitle extends React.Component {

  render() {
    const {title, style, spanStyle} = this.props;
    const divStyle = {'-webkit-box-orient': 'vertical'};
    if (typeof style !== 'undefined') {
      Object.assign(divStyle, style);
    }
    return (
      <div className={`gallery-item-title`} data-hook="item-title" style={divStyle}>
        <span style={spanStyle}>{title}</span>
      </div>
    );
  }
}
