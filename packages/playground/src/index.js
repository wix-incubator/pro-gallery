import './utils/polyfills';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/App/App';
import { PlaygroundGalleryProvider } from './hooks/GalleryContext';

const Root = () => (
  <PlaygroundGalleryProvider>
    <App />
  </PlaygroundGalleryProvider>
);

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
