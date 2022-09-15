import './utils/polyfills';

import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './components/App/App';
import {GalleryProvider} from './hooks/GalleryContext';
import reportWebVitals from './reportWebVitals';

const Root = () => (
  <GalleryProvider>
    <App />
  </GalleryProvider>
);

ReactDOM.render(<Root />, document.getElementById('root'));
reportWebVitals(console.log);