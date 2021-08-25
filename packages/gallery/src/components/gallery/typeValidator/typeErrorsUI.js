import React from 'react';
export default function (typeErrors) {
  return <ol>{typeErrors.map(Error)}</ol>;
}

function Error(errObject) {
  return (
    <li>
      <ErrorDescription errObject={errObject} />
    </li>
  );
}

class ErrorDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showFull: false,
    };

    this.toggle = this.toggle.bind(this); // PUKE
  }

  render() {
    const CompToRender = this.state.showFull ? FullError : Text;
    return (
      <a onClick={this.toggle}>
        <CompToRender errObject={this.props.errObject} />
      </a>
    );
  }

  toggle() {
    this.setState({ showFull: !this.state.showFull });
  }
}

function FullError({ errObject }) {
  return (
    <ul>
      {Object.entries(errObject).map((entry, i) => (
        <Item name={entry} key={i} />
      ))}
    </ul>
  );
}

function Item({ name }) {
  const key = name[0];
  const value = name[1];
  const valueText =
    typeof value === 'string' ? value : JSON.stringify(value, null, 4);
  return <li>{`${key}: ${valueText}`}</li>;
}

function Text({ errObject }) {
  return errObject.message;
}
