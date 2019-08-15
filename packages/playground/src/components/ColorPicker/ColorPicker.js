import React from 'react'
import { ChromePicker } from 'react-color'
import s from "./ColorPicker.module.scss";

class ColorPicker extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      displayColorPicker: false,
      // color: {
      //   r: '241',
      //   g: '112',
      //   b: '19',
      //   a: '1',
      // },
      color: this.props.color,
    };
  }



  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    this.setState({ color: color.rgb })
    this.props.colorChanged && this.props.colorChanged(color.rgb);
  };

  render() {
    return (
      <div>
        <div className={ s.swatch } onClick={ this.handleClick }>
          <div className={ s.color } style={{ background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`}}/>
        </div>
        { this.state.displayColorPicker ? <div className={ s.popover }>
          <div className={ s.cover } onClick={ this.handleClose }/>
          <ChromePicker color={ this.state.color } onChange={ this.handleChange } />
        </div> : null }
      </div>
    )
  }
}

export default ColorPicker;