import React from 'react';

export let GalleryContext;
try {
  GalleryContext = React.createContext({});
} catch (e) {
  GalleryContext = null;
}

export class GalleryProvider extends React.Component {
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
