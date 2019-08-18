import React from 'react';
import { GalleryContext } from '../context/GalleryContext.js';

export class GalleryComponent extends React.Component {
  static contextType = GalleryContext;

  constructor(props) {
    super(props);

    if (typeof this.context !== 'object') {
      this.context = {};
    }

    if (props && typeof props.context === 'object') {
      this.context = { ...this.context, ...props.context };
    }
  }
}
