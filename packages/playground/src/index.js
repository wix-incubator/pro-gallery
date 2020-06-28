import './utils/polyfills';

import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './components/App/App';
import {GalleryProvider} from './hooks/GalleryContext';

const Root = () => (
  <GalleryProvider>
    <App />
  </GalleryProvider>
);

ReactDOM.render(<Root />, document.getElementById('root'));
