import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Loadable from 'react-loadable';

import App from './components/App';
import { ServerDataProvider } from './state/serverDataContext';

import './styles/index.scss';
import 'pro-gallery/dist/statics/main.css';

const serverData = window.__SERVER_DATA__;

export const main = () => {
  setTimeout(() => {
    Loadable.preloadReady().then(() => {
      ReactDOM.hydrate(
        <ServerDataProvider value={serverData}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ServerDataProvider>,
        document.getElementById('root')
      );
    });
  }, 10000);
};
