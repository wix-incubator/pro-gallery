import React from 'react';

export default class ItemTitle extends React.Component {

  render() {
    const {title, style, spanStyle} = this.props;
    return (
      <div className={`gallery-item-title`} data-hook="item-title" style={style}>
        <span style={spanStyle}>{title}</span>
      </div>
    );
  }
}
