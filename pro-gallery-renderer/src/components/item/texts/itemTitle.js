import React from 'react';

export default class ItemTitle extends React.Component {

  render() {
    const {title, style, spanStyle} = this.props;
    const divStyle = Object.assign(style, {'-webkit-box-orient': 'vertical'});
    return (
      <div className={`gallery-item-title`} data-hook="item-title" style={divStyle}>
        <span style={spanStyle}>{title}</span>
      </div>
    );
  }
}
