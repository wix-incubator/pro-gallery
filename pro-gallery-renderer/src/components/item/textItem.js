import React from 'react';

export default class TextItem extends React.Component {
  constructor(props) {
    super(props);
  }

  getTextDimensions() {
    const {style, styleParams, cubeRatio} = this.props;
    const isVerticalItem = style.ratio < (cubeRatio - 0.01);
    //text dimensions include scaling
    const transform = 'translate(0, 0) scale(' + (isVerticalItem ? (style.height / style.maxHeight) : (style.width / style.maxWidth)) + ')';
    return {
      margin: (Math.floor(style.maxHeight - style.height) / -2) + 'px ' + (Math.floor(style.maxWidth - style.width) / -2) + 'px',
      width: style.maxWidth + 'px',
      height: style.maxHeight + 'px',
      WebkitTransform: transform,
      MsTransform: transform,
      OTransform: transform,
      transform: transform,
    };
  }

  componentWillMount() {
    this.props.actions.setItemLoaded()
  }
  
  render() {
    const {visible, id, styleParams, html, style, actions} = this.props;
    const dimensions = this.getTextDimensions();

    return (visible || styleParams.hasThumbnails) ? (
        <div className={'gallery-item-visible gallery-item loaded text-item'}
          key={'item-text-' + id}
          style={Object.assign(dimensions, styleParams.cubeType === 'fit' ? { 'backgroundColor': style.bgColor } : {})}
          onTouchStart={actions.handleItemMouseDown}
          onTouchEnd={actions.handleItemMouseUp}
          dangerouslySetInnerHTML={{ __html: html }}/>
      ) : (
        <div className={'gallery-item-visible gallery-item loaded text-item'}
              key={'item-text-' + id}
              onTouchStart={actions.handleItemMouseDown}
              onTouchEnd={actions.handleItemMouseUp}
              style={dimensions}>
        </div>
      )
  }
}
