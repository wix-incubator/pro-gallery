import React from 'react'

export default class ItemTitle extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    var {id, title, style} = this.props;
    return (
      <div className={`gallery-item-title`} data-hook="item-title" style={style}>{title}</div>
   );
  }
}