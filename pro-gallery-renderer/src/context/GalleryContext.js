import React from 'react';

const GalleryContext = React.createContext({});

class GalleryProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
    const contextFields = ['styleParams'];
    this.value = {
      get: contextFields.reduce(
        (obj, field) => ({ ...obj, [field]: () => this.state[field] }),
        {},
      ),
      set: contextFields.reduce(
        (obj, field) => ({
          ...obj,
          [field]: data => this.setState({ [field]: data }),
        }),
        {},
      ),
    };
  }

  render() {
    const value = { ...this.value, ...this.state };
    return (
      <GalleryContext.Provider value={value}>
        {this.props.children}
      </GalleryContext.Provider>
    );
  }
}

export { GalleryContext, GalleryProvider };
