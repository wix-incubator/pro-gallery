import React from 'react';

export class ScrollAnimations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      css: props.css,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.css !== nextProps.css) {
      this.setState({ css: nextProps.css });
    }
  }

  render() {
    return (
      <style
        id={`scrollAnimationsCss_${this.props.idx}`}
        key={`scrollAnimationsCss_${this.props.idx}`}
        dangerouslySetInnerHTML={{
          __html: this.state.css,
        }}
      />
    );
  }
}
