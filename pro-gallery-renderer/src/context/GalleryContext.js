import React from 'react';

let GalleryContext;
try {
  GalleryContext = React.createContext({});
} catch (e) {
  GalleryContext = null;
}

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
    if (GalleryContext) {
      const value = { ...this.value, ...this.state };
      return (
        <GalleryContext.Provider value={value}>
          {this.props.children}
        </GalleryContext.Provider>
      );
    } else {
      return this.props.children;
    }
  }
}

export { GalleryContext, GalleryProvider };
