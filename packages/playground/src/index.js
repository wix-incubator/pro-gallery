import './utils/polyfills';

import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './components/App/App';
import {PlaygroundGalleryProvider} from './hooks/GalleryContext';

const Root = () => (
  <PlaygroundGalleryProvider>
    <App />
  </PlaygroundGalleryProvider>
);

ReactDOM.render(<Root />, document.getElementById('root'));
