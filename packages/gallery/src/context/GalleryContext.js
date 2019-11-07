import React from 'react';

let GalleryContext;
try {
  GalleryContext = React.createContext({});
} catch (e) {
  GalleryContext = null;
}

const GALLERY_CONTEXT_FIELDS = ['isUnknownWidth'];

const extractContextFields = fields =>
  GALLERY_CONTEXT_FIELDS.reduce(
    (obj, field) => {
      obj[field] = fields[field];
      return obj;
    },
    {},
  );

class GalleryProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = extractContextFields(props);
  }

  render() {
    if (GalleryContext) {
      // const value = { ...this.value, ...this.state };
      return (
        <GalleryContext.Provider value={this.state}>
          {this.props.children}
        </GalleryContext.Provider>
      );
    } else {
      return this.props.children;
    }
  }
}

export { GalleryContext, GalleryProvider, extractContextFields };
